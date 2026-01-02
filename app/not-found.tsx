import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-6xl md:text-8xl text-foreground/20 mb-4">
        404
      </h1>
      <h2 className="font-serif text-2xl md:text-3xl mb-4">
        Lost in the Medina?
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Even the best travelers take a wrong turn sometimes. Let us guide you back.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
        >
          Return Home
        </Link>
        <Link
          href="/rooms"
          className="px-8 py-3 border border-foreground text-foreground text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          View Rooms
        </Link>
      </div>
    </div>
  );
}
