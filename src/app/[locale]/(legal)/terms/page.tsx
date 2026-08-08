import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalDocument } from '@/features/legal/components/legal-document';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Legal.Terms');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function TermsPage() {
  const t = await getTranslations('Legal.Terms');

  return (
    <LegalDocument
      title={t('title')}
      updatedAt={t('updatedAt')}
      intro={t('intro')}
      sections={[
        {
          title: t('s1'),
          paragraphs: [
            'You must be at least 18 years old and legally able to enter into a binding agreement to use TrustAI. You are responsible for ensuring that your use of the platform complies with the laws of your jurisdiction.',
          ],
        },
        {
          title: t('s2'),
          paragraphs: [
            'You agree to provide accurate registration information and to keep your login credentials secure. You are responsible for all activity that occurs under your account. Notify us promptly if you suspect unauthorized access.',
          ],
        },
        {
          title: t('s3'),
          paragraphs: [
            'TrustAI provides market tools, portfolio views, connected provider balances, and AI-assisted insights. TrustAI is not a broker-dealer, exchange, or investment adviser unless expressly stated otherwise in writing.',
            'AI signals, scores, and recommendations are informational only. They are not personalized investment advice and do not guarantee profits or protect against losses.',
          ],
        },
        {
          title: t('s4'),
          paragraphs: [
            'Trading crypto, stocks, metals, and other markets involves substantial risk of loss. Past performance is not indicative of future results. You alone decide whether to place trades through connected providers, and you accept all related risks.',
          ],
        },
        {
          title: t('s5'),
          paragraphs: [
            'When you connect third-party trading or brokerage accounts, you authorize TrustAI to access account data needed to display balances, positions, and related information. Your relationship with each provider remains governed by that provider’s own terms.',
          ],
        },
        {
          title: t('s6'),
          paragraphs: [
            'You may not misuse the platform, attempt to disrupt service, reverse engineer protected systems, scrape data beyond permitted use, or use TrustAI for unlawful activity. We may suspend or terminate accounts that violate these terms.',
          ],
        },
        {
          title: t('s7'),
          paragraphs: [
            'TrustAI branding, software, models, and content are owned by TrustAI Markets Ltd. or its licensors. You receive a limited, non-exclusive right to use the service for your personal or internal business purposes while your account is active.',
          ],
        },
        {
          title: '8. Disclaimers',
          paragraphs: [
            'The service is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant uninterrupted or error-free operation.',
          ],
        },
        {
          title: '9. Limitation of liability',
          paragraphs: [
            'To the fullest extent permitted by law, TrustAI and its affiliates are not liable for indirect, incidental, special, consequential, or punitive damages, or for trading losses arising from your use of the platform or reliance on AI outputs.',
          ],
        },
        {
          title: '10. Changes and termination',
          paragraphs: [
            'We may update these terms from time to time. Continued use after changes become effective constitutes acceptance. You may stop using TrustAI at any time. We may modify or discontinue features, or terminate access, where reasonably necessary.',
          ],
        },
      ]}
    />
  );
}
