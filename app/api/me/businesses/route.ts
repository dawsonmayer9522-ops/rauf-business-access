import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const token = cookies().get('fb_user_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const version = process.env.FB_API_VERSION || 'v19.0';
  try {
    const res = await fetch(
      `https://graph.facebook.com/${version}/me/businesses?fields=id,name&access_token=${encodeURIComponent(
        token
      )}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    // Return only the array for ease of use on the client. Facebook returns { data: [...] }.
    return NextResponse.json(data.data ?? data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 });
  }
}