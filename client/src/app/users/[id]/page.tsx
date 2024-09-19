"use client";

import User from "@/components/user";

const UserPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return <User id={id} />;
};

export default UserPage;
