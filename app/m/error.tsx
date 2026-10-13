"use client";

export default function GuestError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-5xl">The menu could not open</h1>
      <p className="mt-4 leading-7 text-muted">Try again in a moment. If it keeps failing, ask the staff.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-full bg-pine px-5 py-3 text-sm text-cream">
        Try again
      </button>
    </div>
  );
}
