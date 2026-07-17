import {
  Bell,
  CircleHelp,
  HelpCircle,
  History,
  Languages,
  Link2,
  LogOut,
  MessageCircle,
  Palette,
  Shield,
  SlidersHorizontal,
  Trash2,
  User,
  UserPlus,
  Info,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SettingsLink } from "@/features/profile/components/settings-link";
import { routes } from "@/shared/lib/routes";

export function ProfileSettingsGrid() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="space-y-4">
        <SettingsCard
          title="Account"
          items={[
            {
              label: "Personal Information",
              description: "Name, email, phone",
              icon: User,
              href: routes.settings,
            },
            {
              label: "Verification",
              description: "Identity & KYC",
              icon: BadgeCheck,
              badge: "Verified",
              badgeTone: "success",
              href: routes.verification,
            },
            {
              label: "Security",
              description: "Password, 2FA",
              icon: Shield,
              href: routes.security,
            },
          ]}
        />
        <SettingsCard
          title="Trading"
          items={[
            {
              label: "Connected Accounts",
              description: "Binance · 2 linked",
              icon: Link2,
            },
            {
              label: "Trading Preferences",
              description: "Defaults & risk",
              icon: SlidersHorizontal,
              href: routes.settings,
            },
            {
              label: "Order & Trade History",
              description: "View past activity",
              icon: History,
              href: routes.orders,
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        <SettingsCard
          title="Preferences"
          items={[
            {
              label: "Language",
              description: "English",
              icon: Languages,
              href: routes.settings,
            },
            {
              label: "Appearance",
              description: "Light Mode",
              icon: Palette,
              href: routes.settings,
            },
            {
              label: "Notifications",
              description: "Emails & push",
              icon: Bell,
              href: routes.settings,
            },
          ]}
        />
        <SettingsCard
          title="Support"
          items={[
            {
              label: "Help Center",
              description: "Guides & FAQs",
              icon: CircleHelp,
              href: routes.help,
            },
            {
              label: "FAQs",
              description: "Common questions",
              icon: HelpCircle,
              href: routes.faq,
            },
            {
              label: "Contact Support",
              description: "Get help from us",
              icon: MessageCircle,
              href: routes.contact,
            },
            {
              label: "Chat with AI Assistant",
              description: "Ask anything",
              icon: Sparkles,
              badge: "New",
              badgeTone: "primary",
              href: routes.aiSignals,
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        <SettingsCard
          title="Other"
          items={[
            {
              label: "Invite Friends",
              description: "Earn rewards",
              icon: UserPlus,
              badge: "Rewards",
              badgeTone: "success",
            },
            {
              label: "About TrustAI",
              description: "Version 1.0.0",
              icon: Info,
              href: routes.about,
            },
            {
              label: "Log Out",
              description: "Sign out of this device",
              icon: LogOut,
              href: routes.login,
            },
          ]}
        />

        <Card className="border-destructive/30 bg-destructive/5 dark:bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingsLink
              item={{
                label: "Delete Account",
                description: "Permanently delete your data",
                icon: Trash2,
                danger: true,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  items,
}: {
  title: string;
  items: React.ComponentProps<typeof SettingsLink>["item"][];
}) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0.5 pt-0">
        {items.map((item) => (
          <SettingsLink key={item.label} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}
