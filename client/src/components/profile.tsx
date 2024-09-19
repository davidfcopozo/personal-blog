"use client";
import { useAuth } from "@/context/AuthContext";
import UserProfile from "./user-profile";

const Profile = () => {
  const { currentUser } = useAuth();

  return <UserProfile user={currentUser?.data} />;
};

export default Profile;
