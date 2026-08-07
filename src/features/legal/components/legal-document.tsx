import { getSettingsAction } from '@/features/app-settings/actions/get-settings';
import { DEFAULT_APP_SETTINGS } from '@/features/app-settings/types';

type LegalSection = {
  title: string;
  paragraphs: string[];
};

export async function LegalDocument({
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
  const settingsResult = await getSettingsAction();
  const supportEmail = settingsResult.ok
    ? settingsResult.data.support_email
    : DEFAULT_APP_SETTINGS.support_email;

  return (
    <article className="space-y-8">
      <header className="border-border space-y-3 border-b pb-8">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm">
          Last updated {updatedAt}
        </p>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {intro}
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-foreground text-lg font-semibold tracking-tight">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="border-border text-muted-foreground border-t pt-6 text-sm">
        Questions? Email{' '}
        <a
          href={`mailto:${supportEmail}`}
          className="text-primary font-medium hover:underline"
        >
          {supportEmail}
        </a>
        .
      </p>
    </article>
  );
}
