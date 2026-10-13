"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-5xl">This page could not load</h1>
      <button type="button" onClick={reset} className="mt-6 rounded-full bg-pine px-5 py-3 text-sm text-cream">
        Try again
      </button>
    </div>
  );
}
