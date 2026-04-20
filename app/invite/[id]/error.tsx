'use client';

import { useEffect } from 'react';

export default function InviteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong!</h2>
      <p className="text-slate-600 mb-8 max-w-md text-center">
        We couldn't load the invitation. Please try again or contact support if the issue persists.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
