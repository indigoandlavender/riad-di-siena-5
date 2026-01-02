interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground/80">
          {title}
        </h1>
        {subtitle && (
          <p className="font-display text-lg italic text-foreground/60 max-w-2xl mx-auto mt-6">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
