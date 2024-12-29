"use client";
import { useAuth } from "@/context/AuthContext";
import UserProfile from "./user-profile";
import ProfilePageSkeleton from "./profile-page-skeleton";

const Profile = () => {
  const { currentUser, isUserPending } = useAuth();

  return (
    <div className="min-h-screen mt-14">
      <UserProfile user={currentUser?.data} isUserPending={isUserPending} />
    </div>
  );
};

export default Profile;
