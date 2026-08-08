import { getCurrentUser } from '@/features/auth/get-current-user';
import { getUserSettingsAction } from '@/features/settings/actions/get-user-settings';
import { SettingsView } from '@/features/settings';

export default async function SettingsPage() {
  const [settingsResult, user] = await Promise.all([
    getUserSettingsAction(),
    getCurrentUser(),
  ]);

  if (!settingsResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load settings
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {settingsResult.message}
        </p>
      </div>
    );
  }

  return (
    <SettingsView
      data={settingsResult.data}
      profile={{
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        country: user.country,
      }}
    />
  );
}
