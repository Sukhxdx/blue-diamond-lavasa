import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <h1 className="font-serif text-5xl">Not available</h1>
      <p className="mt-4 leading-7 text-muted">This account cannot open that page.</p>
      <Link href="/admin" className="mt-6 inline-flex rounded-full bg-pine px-5 py-3 text-sm text-cream">
        Back
      </Link>
    </div>
  );
}
