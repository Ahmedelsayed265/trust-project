import { ProfileHero } from "@/features/profile/components/profile-hero";
import { ProfileAccountOverview } from "@/features/profile/components/profile-account-overview";
import { ProfileSettingsGrid } from "@/features/profile/components/profile-settings-grid";

export function ProfileView() {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <ProfileHero />
      <ProfileAccountOverview />
      <ProfileSettingsGrid />
    </div>
  );
}
