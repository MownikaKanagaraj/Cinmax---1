import { NextResponse } from 'next/server';
import { getContainer } from '@cinmax/api';

export async function GET() {
  try {
    const container = getContainer();
    const settings = await container.homeMarketing.getSettings();

    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch home marketing settings' },
      { status: 500 }
    );
  }
}

