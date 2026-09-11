import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    const urlObj = new URL(targetUrl);
    
    // Fetch the target website
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || '';
    let body = await response.text();

    if (contentType.toLowerCase().includes('text/html')) {
      // The base URL should be the origin + the path
      const baseTag = `<base href="${urlObj.origin}${urlObj.pathname}">`;
      
      // Prevent modern SPAs (Next.js, React Router) from reading the proxy URL 
      // and immediately trying to redirect the iframe back to their native domain.
      const hijackScript = `
        <script>
          // Hijack history to prevent SPA routers from navigating the iframe
          const originalPushState = window.history.pushState;
          const originalReplaceState = window.history.replaceState;
          window.history.pushState = function() {};
          window.history.replaceState = function() {};
          
          // Attempt to block direct window.location assignments
          window.addEventListener('beforeunload', function(e) {
            e.preventDefault();
            e.returnValue = '';
          });
        </script>
      `;
      
      if (body.includes('<head>')) {
        body = body.replace('<head>', `<head>\n${hijackScript}\n${baseTag}`);
      } else if (body.match(/<head[^>]*>/i)) {
        body = body.replace(/(<head[^>]*>)/i, `$1\n${hijackScript}\n${baseTag}`);
      } else {
        // Fallback: prepend if no head tag is found
        body = `${hijackScript}\n${baseTag}\n${body}`;
      }
    }

    const proxyResponse = new NextResponse(body, {
      status: response.status,
      statusText: response.statusText,
    });

    // Pass through safe headers
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // Drop headers that prevent embedding or alter encoding (since we decoded the text)
      if (
        ['x-frame-options', 'content-security-policy', 'content-encoding', 'transfer-encoding'].includes(lowerKey)
      ) {
        return;
      }
      proxyResponse.headers.set(key, value);
    });

    return proxyResponse;
  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse(
      `<div style="font-family:sans-serif;padding:2rem;text-align:center;">
         <h2>Proxy Error</h2>
         <p>Failed to load <b>${targetUrl}</b>.</p>
         <p style="color:#666;font-size:14px;">The site may be down, or it is actively blocking server bots.</p>
       </div>`, 
      { 
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}
