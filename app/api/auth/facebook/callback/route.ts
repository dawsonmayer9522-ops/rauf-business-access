import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('fb_oauth_state')?.value;
  // Validate state to mitigate CSRF.
  if (!state || !storedState || state !== storedState) {
    // Clear state cookie and redirect to home.
    const redirectResp = NextResponse.redirect('/', 302);
    redirectResp.cookies.set('fb_oauth_state', '', { maxAge: 0, path: '/' });
    return redirectResp;
  }
  if (!code) {
    // Missing authorization code; redirect to home.
    const redirectResp = NextResponse.redirect('/', 302);
    redirectResp.cookies.set('fb_oauth_state', '', { maxAge: 0, path: '/' });
    return redirectResp;
  }
  // Exchange code for an access token.
  const fbAppId = process.env.FB_APP_ID;
  const fbAppSecret = process.env.FB_APP_SECRET;
  const fbRedirectUri = process.env.FB_REDIRECT_URI;
  const fbApiVersion = process.env.FB_API_VERSION || 'v19.0';
  if (!fbAppId || !fbAppSecret || !fbRedirectUri) {
    const resp = NextResponse.redirect('/', 302);
    resp.cookies.set('fb_oauth_state', '', { maxAge: 0, path: '/' });
    return resp;
  }
  try {
    const tokenRes = await fetch(
      `https://graph.facebook.com/${fbApiVersion}/oauth/access_token?client_id=${encodeURIComponent(
        fbAppId
      )}&client_secret=${encodeURIComponent(
        fbAppSecret
      )}&redirect_uri=${encodeURIComponent(
        fbRedirectUri
      )}&code=${encodeURIComponent(code)}`,
      {
        method: 'GET',
      }
    );
    const tokenData = await tokenRes.json();
    const accessToken: string | undefined = tokenData.access_token;
    if (!accessToken) {
      // Something went wrong; redirect home.
      const resp = NextResponse.redirect('/', 302);
      resp.cookies.set('fb_oauth_state', '', { maxAge: 0, path: '/' });
      return resp;
    }
    // Store access token in a secure HttpOnly cookie for later API calls.
    const response = NextResponse.redirect('/select-business', 302);
    response.cookies.set('fb_user_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours
    });
    // Clear state cookie.
    response.cookies.set('fb_oauth_state', '', { maxAge: 0, path: '/' });
    return response;
  } catch (err) {
    // On error redirect home and clear state.
    const resp = NextResponse.redirect('/', 302);
    resp.cookies.set('fb_oauth_state', '', { maxAge: 0, path: '/' });
    return resp;
  }
}