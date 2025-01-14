"use client";
import UserProfile from "@/components/user-profile";
import { useFetchUserByUsername } from "@/hooks/useFetchUserByUsername";
import NotFound from "../not-found";

const UserPage = ({ params }: { params: { username: string } }) => {
  const { data, isPending } = useFetchUserByUsername(`${params.username}`);

  if (!data && !isPending) {
    return <NotFound />;
  }

  return (
    <div>
      <UserProfile user={data?.data} isUserPending={isPending} />
    </div>
  );
};

export default UserPage;
