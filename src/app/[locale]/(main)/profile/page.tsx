import { getHomeAction } from '@/features/dashboard/actions/get-home';
import { ProfileView } from '@/features/profile';

export default async function ProfilePage() {
  const result = await getHomeAction();
  const portfolio = result.ok ? result.data.portfolio : null;
  const accounts = result.ok ? result.data.accounts : [];

  return <ProfileView portfolio={portfolio} accounts={accounts} />;
}
