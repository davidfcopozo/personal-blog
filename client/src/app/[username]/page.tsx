"use client";
import ProfilePageSkeleton from "@/components/profile-page-skeleton";
import UserProfile from "@/components/user-profile";
import { useFetchUserByUsername } from "@/hooks/useFetchUserByUsername";

const UserPage = ({ params }: { params: { username: string } }) => {
  const { data, isPending } = useFetchUserByUsername(`${params.username}`);
  if (isPending) return <ProfilePageSkeleton />;

  return (
    <div>
      <UserProfile user={data?.data} />
    </div>
  );
};

export default UserPage;
