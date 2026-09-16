import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CreateProductSchema, SupabaseProductRepository, MockProductRepository } from '@cinmax/api';

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const categorySlug = searchParams.get('category') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '50', 10);

    const repo = getProductRepository();
    const result = await repo.getAll({ searchQuery: search, categorySlug }, { page, pageSize });

    return NextResponse.json({
      success: true,
      items: result.items.map((e) => e.toJSON()),
      meta: result.meta,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate with Zod
    const validated = CreateProductSchema.parse(body);

    const repo = getProductRepository();
    const createdEntity = await repo.createProduct(validated as any);

    return NextResponse.json(
      {
        success: true,
        message: 'Product formulation created and persisted successfully.',
        product: createdEntity.toJSON(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API Products POST Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error.errors ? error.errors.map((e: any) => e.message).join(', ') : error.message,
      },
      { status: 400 }
    );
  }
}
