import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface Context {
  params: {
    page_id: string;
  };
}

export async function GET(req: Request, context: Context) {
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
      )}?fields=id,name,link,fan_count,category&access_token=${encodeURIComponent(
        token
      )}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch page details' }, { status: 500 });
  }
}