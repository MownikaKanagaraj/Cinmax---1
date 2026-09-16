import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { UpdateProductSchema, SupabaseProductRepository, MockProductRepository } from '@cinmax/api';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nthyavlzdgucrldtgjeo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

function getProductRepository() {
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    return new SupabaseProductRepository(supabase as any);
  } catch (err) {
    return new MockProductRepository();
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repo = getProductRepository();
    const product = (await repo.getById(id)) || (await repo.getBySlug(id));

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: product.toJSON() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateProductSchema.parse({ ...body, id });

    const repo = getProductRepository();
    const updated = await repo.updateProduct(id, validated as any);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully.',
      product: updated.toJSON(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.errors ? error.errors.map((e: any) => e.message).join(', ') : error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repo = getProductRepository();
    await repo.deleteProduct(id);

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
