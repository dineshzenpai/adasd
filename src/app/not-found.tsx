import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">
        This thread came <em className="display-italic text-clay-deep">loose</em>
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
        The page you&apos;re looking for isn&apos;t on our rail. Let&apos;s get you back to the soft stuff.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Back home
        </Link>
        <Link href="/shop" className="btn btn-outline">
          Shop the collection
        </Link>
      </div>
    </div>
  );
}
