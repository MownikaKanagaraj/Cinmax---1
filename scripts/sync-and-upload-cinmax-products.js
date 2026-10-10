const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const workspaceRoot = path.resolve(__dirname, '..');
const cinmaxDir = path.join(workspaceRoot, 'CINMAX');

const PRODUCT_MAPPINGS = [
  { folder: 'AROMA', title: 'Aroma Soap', slug: 'aroma-soap', price: 249 },
  { folder: 'ALOEVERA', title: 'Aloe Vera Soap', slug: 'aloe-vera-soap', price: 249 },
  { folder: 'AVARAMPOO', title: 'Avarampoo Soap', slug: 'avarampoo-soap', price: 289 },
  { folder: 'CHARCOAL', title: 'Charcoal Soap', slug: 'charcoal-soap', price: 279 },
  { folder: 'KASTHURI MANJAL', title: 'Kasturi Manjal Soap', slug: 'kasturi-manjal-soap', price: 299 },
  { folder: 'MANJISTHA', title: 'Manjistha Soap', slug: 'manjistha-soap', price: 299 },
  { folder: 'NEEM', title: 'Neem Oil Soap', slug: 'neem-oil-soap', price: 249 },
  { folder: 'PAPPAYA', title: 'Papaya Soap', slug: 'papaya-soap', price: 279 },
  { folder: 'ROSE', title: 'Rose Soap', slug: 'rose-soap', price: 299 },
  { folder: 'VEPPALAI', title: 'Veppalai Soap', slug: 'veppalai-soap', price: 299 },
  { folder: 'VETTIVER', title: 'Vettiver Soap', slug: 'vettiver-soap', price: 289 },
];

const targetCopyDirs = [
  path.join(workspaceRoot, 'apps', 'website', 'public', 'products'),
  path.join(workspaceRoot, 'apps', 'admin', 'public', 'products'),
  path.join(workspaceRoot, 'apps', 'mobile', 'assets', 'products'),
];

async function main() {
  console.log('=== Step 1: Copying 44 original images to local project asset folders ===');
  for (const prod of PRODUCT_MAPPINGS) {
    const srcFolder = path.join(cinmaxDir, prod.folder);
    if (!fs.existsSync(srcFolder)) {
      console.error(`Source folder not found: ${srcFolder}`);
      continue;
    }

    for (const targetBase of targetCopyDirs) {
      const destFolder = path.join(targetBase, prod.slug);
      fs.mkdirSync(destFolder, { recursive: true });
      for (let i = 1; i <= 4; i++) {
        const srcFile = path.join(srcFolder, `${i}.jpg`);
        const destFile = path.join(destFolder, `${i}.jpg`);
        if (fs.existsSync(srcFile)) {
          fs.copyFileSync(srcFile, destFile);
        }
      }
    }
    console.log(`✓ Copied 4 images for ${prod.title} (${prod.slug})`);
  }

  console.log('\n=== Step 2: Uploading 44 original images to Supabase Storage ===');
  const uploadedUrls = {};

  for (const prod of PRODUCT_MAPPINGS) {
    uploadedUrls[prod.slug] = [];
    const srcFolder = path.join(cinmaxDir, prod.folder);

    for (let i = 1; i <= 4; i++) {
      const srcFile = path.join(srcFolder, `${i}.jpg`);
      if (!fs.existsSync(srcFile)) {
        console.error(`File not found: ${srcFile}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(srcFile);
      const storageKey = `cinmax-products/${prod.slug}/${i}.jpg`;

      const { data, error } = await supabase.storage.from('products').upload(storageKey, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

      if (error) {
        console.error(`Error uploading ${storageKey}:`, error);
      } else {
        const { data: pubData } = supabase.storage.from('products').getPublicUrl(storageKey);
        uploadedUrls[prod.slug].push(pubData.publicUrl);
        console.log(`✓ Uploaded ${prod.title} [${i}/4] -> ${pubData.publicUrl}`);
      }
    }
  }

  console.log('\n=== Step 3: Updating database products & product_images ===');
  // 1. Deactivate all test/dummy/legacy products
  const activeSlugs = PRODUCT_MAPPINGS.map((p) => p.slug);
  const { data: allProds } = await supabase.from('products').select('id, slug, title');
  
  for (const p of allProds || []) {
    if (!activeSlugs.includes(p.slug)) {
      console.log(`Deactivating non-CINMAX product: ${p.title} (${p.slug})`);
      await supabase.from('products').update({ is_active: false }).eq('id', p.id);
    }
  }

  // 2. Ensure each of the 11 CINMAX products exists and is active, with its 4 exact images
  for (const prod of PRODUCT_MAPPINGS) {
    let dbProd = (allProds || []).find((p) => p.slug === prod.slug);

    if (!dbProd) {
      console.log(`Creating product: ${prod.title}`);
      const { data: created, error: createErr } = await supabase.from('products').insert({
        title: prod.title,
        slug: prod.slug,
        base_price: prod.price,
        is_active: true,
        process_type: 'cold-process',
      }).select().single();

      if (createErr) {
        console.error(`Error creating ${prod.slug}:`, createErr);
        continue;
      }
      dbProd = created;
    } else {
      await supabase.from('products').update({
        title: prod.title,
        is_active: true,
        base_price: prod.price,
      }).eq('id', dbProd.id);
    }

    // Delete previous product images for this product
    await supabase.from('product_images').delete().eq('product_id', dbProd.id);

    // Insert the 4 authentic uploaded images
    const imagesToInsert = (uploadedUrls[prod.slug] || []).map((url, idx) => ({
      product_id: dbProd.id,
      url: url,
      alt: `${prod.title} View ${idx + 1}`,
      sort_order: idx,
      is_primary: idx === 0,
    }));

    if (imagesToInsert.length > 0) {
      const { error: imgErr } = await supabase.from('product_images').insert(imagesToInsert);
      if (imgErr) {
        console.error(`Error inserting images for ${prod.slug}:`, imgErr);
      } else {
        console.log(`✓ Attached 4 authentic images to ${prod.title}`);
      }
    }
  }

  console.log('\n=== Step 4: Verification ===');
  const { data: finalActiveProds } = await supabase
    .from('products')
    .select('id, title, slug, is_active, base_price, product_images(*)')
    .eq('is_active', true);

  console.log(`TOTAL ACTIVE PRODUCTS: ${finalActiveProds ? finalActiveProds.length : 0}`);
  for (const p of finalActiveProds || []) {
    console.log(`- ${p.title} (slug: ${p.slug}, ₹${p.base_price}) | Images: ${p.product_images?.length || 0}`);
    p.product_images?.forEach((img, idx) => {
      console.log(`    [${idx + 1}] ${img.url} (primary: ${img.is_primary})`);
    });
  }
}

main().catch(console.error);
