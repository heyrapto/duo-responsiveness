import { redirect } from 'next/navigation';
import Simulator from '@/components/Simulator';

export default async function TestPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawUrl = Array.isArray(params.url) ? params.url[0] : params.url;

  // Guard: if no URL was provided, send the user back to the homepage.
  if (!rawUrl) {
    redirect('/');
  }

  return (
    // flex-1 lets this page fill the full remaining body height from the
    // root layout so the Simulator can use 100% of the viewport.
    <div className="flex flex-col flex-1">
      <Simulator url={rawUrl} />
    </div>
  );
}
