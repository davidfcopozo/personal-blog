import { useUser } from "@/hooks/useUser";
import UserProfile from "./user-profile";
import ProfilePageSkeleton from "./profile-page-skeleton";

const User = ({ id }: { id: string }) => {
  const {
    data: userData,
    error: userError,
    isFetching: isUserFetching,
    isLoading: isUserLoading,
  } = useUser(id as string);
  const user = userData?.data;
  return (
    <div className="min-h-screen mt-14">
      {isUserFetching || isUserLoading ? (
        <ProfilePageSkeleton />
      ) : (
        <UserProfile user={user} />
      )}
    </div>
  );
};

export default User;
