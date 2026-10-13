"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <h1 className="font-serif text-5xl">Something went wrong</h1>
      <p className="mt-4 leading-7 text-muted">
        The page could not be loaded. You can try again.
      </p>
      {error.digest ? <p className="mt-2 text-xs text-muted">Reference: {error.digest}</p> : null}
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-pine px-5 py-3 text-sm text-cream"
      >
        Try again
      </button>
    </div>
  );
}
