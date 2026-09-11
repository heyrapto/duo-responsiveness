'use server';

/**
 * Checks if a given URL allows itself to be embedded in an iframe.
 * It looks at X-Frame-Options and Content-Security-Policy headers.
 */
export async function checkEmbeddable(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    // We use GET because some servers behave differently or drop headers on HEAD requests
    const res = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    
    clearTimeout(timeoutId);
    
    const xFrame = res.headers.get('x-frame-options')?.toLowerCase();
    const csp = res.headers.get('content-security-policy')?.toLowerCase();
    
    if (xFrame === 'deny' || xFrame === 'sameorigin') {
      return false;
    }
    
    if (csp && csp.includes('frame-ancestors')) {
      // If frame-ancestors is present, it's almost certainly restricting embedding.
      // We aren't doing a full CSP parser, but this catches modern blocks (like vercel.com)
      if (!csp.includes('frame-ancestors *')) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    // If the fetch fails (timeout, DNS error, network block),
    // we return true and let the client's native iframe attempt to load it anyway.
    return true;
  }
}
