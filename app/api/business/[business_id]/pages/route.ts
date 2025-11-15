import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface Context {
  params: {
    business_id: string;
  };
}

export async function GET(req: Request, context: Context) {
  const token = cookies().get('fb_user_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { business_id } = context.params;
  const version = process.env.FB_API_VERSION || 'v19.0';
  try {
    const res = await fetch(
      `https://graph.facebook.com/${version}/${encodeURIComponent(
        business_id
      )}/owned_pages?fields=id,name,picture{url}&access_token=${encodeURIComponent(token)}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return NextResponse.json(data.data ?? data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}