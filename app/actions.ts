'use server';

import { parseHttpUrl } from '@/lib/url';

export async function checkEmbeddable(url: string): Promise<boolean> {
  const parsedUrl = parseHttpUrl(url);
  if (!parsedUrl) return true;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(parsedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const frameOptions = response.headers.get('x-frame-options')?.toLowerCase();
    const contentSecurityPolicy = response.headers
      .get('content-security-policy')
      ?.toLowerCase();

    if (frameOptions === 'deny' || frameOptions === 'sameorigin') return false;
    if (
      contentSecurityPolicy?.includes('frame-ancestors') &&
      !contentSecurityPolicy.includes('frame-ancestors *')
    ) {
      return false;
    }

    return true;
  } catch {
    return true;
  } finally {
    clearTimeout(timeoutId);
  }
}