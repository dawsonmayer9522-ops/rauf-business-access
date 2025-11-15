import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface Context {
  params: {
    page_id: string;
  };
}

export async function POST(req: Request, context: Context) {
  const token = cookies().get('fb_user_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { page_id } = context.params;
  const version = process.env.FB_API_VERSION || 'v19.0';
  try {
    const res = await fetch(
      `https://graph.facebook.com/${version}/${encodeURIComponent(
        page_id
      )}/subscribed_apps?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to subscribe app' }, { status: 500 });
  }
}