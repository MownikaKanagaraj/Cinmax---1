import { NextResponse } from 'next/server';
import { getContainer } from '@cinmax/api';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, playlistId } = body;

    if (!userId || !playlistId) {
      return NextResponse.json(
        { error: 'User ID and Playlist ID are required.' },
        { status: 400 }
      );
    }

    const container = getContainer();
    const hasAccess = await container.playlistRepo.verifyPlaylistAccess(userId, playlistId);

    if (!hasAccess) {
      return NextResponse.json(
        {
          access: false,
          message: 'Access Denied: This playlist is locked. Verified Razorpay payment required to watch classes.',
        },
        { status: 403 }
      );
    }

    const playlist = await container.playlistRepo.getPlaylistById(playlistId);

    return NextResponse.json({
      access: true,
      playlistId,
      title: playlist?.title,
      videos: playlist?.videos || [],
    });
  } catch (error: any) {
    console.error('API playlist-access error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify playlist access' },
      { status: 500 }
    );
  }
}
