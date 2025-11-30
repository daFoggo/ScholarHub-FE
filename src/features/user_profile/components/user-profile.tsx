import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import AchievementsSection from "./achievements-section";
import CertificationsSection from "./certifications-section";
import DocumentsSection from "./documents-section";
import EducationSection from "./educations-section";
import ExperienceSection from "./experiences-section";
import { ProfileHeader } from "./header-section";
import PersonalInfoSection from "./personal-infos-section";
import PublicationsSection from "./publications-section";
import ReferencesSection from "./references-section";
import { WalletCard } from "./wallet-card";
import { useGetPersonal } from "../hooks/use-personal";

export const UserProfile = ({
  userId,
  showHeader = true,
  showInOneColumn = false,
}: {
  userId: string;
  showHeader?: boolean;
  showInOneColumn?: boolean;
}) => {
  const { user, checkCurrentUser } = useAuth();
  const { data: personalData } = useGetPersonal();

  const isCurrentUser = checkCurrentUser(userId);

  return (
    <div className="flex flex-col gap-6">
      {showHeader && user && (
        <ProfileHeader
          userData={user}
          isCurrentUser={isCurrentUser}
          userId={userId}
          createdAt={user?.created_at}
        />
      )}
      <div
        className={cn(
          "gap-6 grid",
          showInOneColumn ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-5"
        )}
      >
        <div className="space-y-6 lg:col-span-2">
          {isCurrentUser && (
            <WalletCard
              walletAddress={personalData?.wallet_address}
              sptBalance={personalData?.spt_balance}
            />
          )}
          <PersonalInfoSection isCurrentUser={isCurrentUser} />
          <DocumentsSection isCurrentUser={isCurrentUser} />
        </div>
        <div className="space-y-6 lg:col-span-3">
          <EducationSection isCurrentUser={isCurrentUser} />
          <ExperienceSection isCurrentUser={isCurrentUser} />
          <AchievementsSection isCurrentUser={isCurrentUser} />
          <CertificationsSection isCurrentUser={isCurrentUser} />
          <PublicationsSection isCurrentUser={isCurrentUser} />
          <ReferencesSection isCurrentUser={isCurrentUser} />
        </div>
      </div>
    </div>
  );
};
