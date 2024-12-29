"use client";
import UserProfile from "@/components/user-profile";
import { useFetchUserByUsername } from "@/hooks/useFetchUserByUsername";

const UserPage = ({ params }: { params: { username: string } }) => {
  const { data, isPending } = useFetchUserByUsername(`${params.username}`);

  return (
    <div>
      <UserProfile user={data?.data} isUserPending={isPending} />
    </div>
  );
};

export default UserPage;
