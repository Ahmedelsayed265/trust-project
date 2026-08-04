import type { Metadata } from "next";
import { LegalDocument } from "@/features/legal/components/legal-document";

export const metadata: Metadata = {
  title: "Privacy Policy — TrustAI",
  description: "Privacy Policy for the TrustAI trading platform.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      updatedAt="August 5, 2026"
      intro="This Privacy Policy explains how TrustAI Markets Ltd. collects, uses, and shares information when you use TrustAI. We aim to be clear about what we need to run the product and keep your account secure."
      sections={[
        {
          title: "1. Information we collect",
          paragraphs: [
            "Account data: name, email address, password (hashed), and optional profile details such as phone, country, language, currency, and timezone.",
            "Usage data: pages visited, feature interactions, device type, approximate location derived from IP, and diagnostic logs needed to operate and improve the service.",
            "Provider data: when you connect a trading account, we may process balances, positions, and related metadata returned by that provider’s APIs, subject to your authorization.",
          ],
        },
        {
          title: "2. How we use information",
          paragraphs: [
            "We use your information to create and secure your account, provide dashboard and AI features, sync connected providers, send transactional alerts you enable, improve product quality, and comply with legal obligations.",
            "We do not sell your personal information.",
          ],
        },
        {
          title: "3. Cookies and session",
          paragraphs: [
            "We use an httpOnly session cookie to keep you signed in after login or registration. Theme and similar preferences may also be stored locally in your browser. You can clear cookies through your browser settings, which will sign you out.",
          ],
        },
        {
          title: "4. Sharing",
          paragraphs: [
            "We may share information with infrastructure and analytics providers that help us host and operate TrustAI, with connected trading providers when you initiate a connection, and with authorities when required by law.",
            "Service providers are only permitted to process data as needed to perform services for us and under appropriate confidentiality obligations.",
          ],
        },
        {
          title: "5. Data retention",
          paragraphs: [
            "We retain account and usage data for as long as your account is active and for a reasonable period afterward for security, dispute resolution, and legal compliance. You may request account deletion by contacting support.",
          ],
        },
        {
          title: "6. Security",
          paragraphs: [
            "We use industry-standard safeguards such as encrypted transport (HTTPS in production), httpOnly cookies for session tokens, and access controls. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
          ],
        },
        {
          title: "7. Your choices",
          paragraphs: [
            "You can update profile settings in the app, disable certain alert preferences, disconnect providers, and request access, correction, or deletion of personal data where applicable law provides those rights.",
          ],
        },
        {
          title: "8. International transfers",
          paragraphs: [
            "Your information may be processed in countries other than your own. Where required, we use appropriate safeguards for cross-border transfers.",
          ],
        },
        {
          title: "9. Children",
          paragraphs: [
            "TrustAI is not directed to individuals under 18. We do not knowingly collect personal information from children.",
          ],
        },
        {
          title: "10. Changes to this policy",
          paragraphs: [
            "We may update this Privacy Policy periodically. We will revise the “Last updated” date and, when changes are material, provide additional notice where appropriate.",
          ],
        },
      ]}
    />
  );
}
