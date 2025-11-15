import { NextResponse } from 'next/server';

/**
 * Generates a random CSRF token for the OAuth flow.
 */
function generateState() {
  // Use the crypto API to generate a random UUID. This will work both in
  // Node.js (supported by Next.js) and modern browsers.
  return crypto.randomUUID();
}

export async function GET() {
  const fbAppId = process.env.FB_APP_ID;
  const fbRedirectUri = process.env.FB_REDIRECT_URI;
  if (!fbAppId || !fbRedirectUri) {
    return new NextResponse('Facebook app environment variables not configured', {
      status: 500,
    });
  }
  const state = generateState();
  const scope = [
    'public_profile',
    'business_management',
    'pages_show_list',
    'pages_manage_metadata',
  ].join(',');
  const authUrl = new URL('https://www.facebook.com/dialog/oauth');
  authUrl.searchParams.set('client_id', fbAppId);
  authUrl.searchParams.set('redirect_uri', fbRedirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', scope);
  // Build a redirect response and set the CSRF state token in an HttpOnly cookie.
  const response = NextResponse.redirect(authUrl.toString(), 302);
  response.cookies.set('fb_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 5, // 5 minutes
  });
  return response;
}