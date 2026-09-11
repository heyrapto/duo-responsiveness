import { redirect } from 'next/navigation';
import Simulator from '@/components/Simulator';

export default async function TestPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawUrl = Array.isArray(params.url) ? params.url[0] : params.url;

  if (!rawUrl) {
    redirect('/');
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Simulator key={rawUrl} url={rawUrl} />
    </div>
  );
}
