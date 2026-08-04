type LegalSection = {
  title: string;
  paragraphs: string[];
};

export function LegalDocument({
  title,
  updatedAt,
  intro,
  sections,
}: {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <article className="space-y-8">
      <header className="space-y-3 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">Last updated {updatedAt}</p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {intro}
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        Questions? Email{" "}
        <a
          href="mailto:support@trustai.app"
          className="font-medium text-primary hover:underline"
        >
          support@trustai.app
        </a>
        .
      </p>
    </article>
  );
}
