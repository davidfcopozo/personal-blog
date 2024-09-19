"use client";
import { useAuth } from "@/context/AuthContext";
import UserProfile from "./user-profile";
import ProfilePageSkeleton from "./profile-page-skeleton";

const Profile = () => {
  const { currentUser, isUserFetching, isUserLoading } = useAuth();

  return (
    <div className="min-h-screen mt-14">
      {isUserFetching || isUserLoading ? (
        <ProfilePageSkeleton />
      ) : (
        <UserProfile user={currentUser?.data} />
      )}
    </div>
  );
};

export default Profile;
