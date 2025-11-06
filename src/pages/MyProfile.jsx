import { ProfileContent } from "../components/ProfileContent";
import { ProfileHeader } from "../components/ProfileHeader";

export function MyProfile() {
  return (
    <div className="w-full md:p-4">
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
}
