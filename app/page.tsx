'use client';

import dynamic from 'next/dynamic';

const TypingTest = dynamic(() => import('@/components/TypingTest'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#0f0f0f] text-zinc-100">
      <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-800" />
    </div>
  )
});

export default function Home() {
  return <TypingTest />;
}