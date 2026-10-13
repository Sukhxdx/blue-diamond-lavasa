import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <p className="text-xs uppercase tracking-[0.18em] text-brass">404</p>
      <h1 className="mt-3 font-serif text-5xl">This page is not here</h1>
      <p className="mt-4 leading-7 text-muted">
        The link may be out of date. Return to the home page to look at the villa and the hotel.
      </p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-pine px-5 py-3 text-sm text-cream">
        Back home
      </Link>
    </div>
  );
}
