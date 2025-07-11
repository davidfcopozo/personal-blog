"use client";;
import { use } from "react";

import User from "@/components/user";

const UserPage = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params);
  const { id } = params;

  return <User id={id} />;
};

export default UserPage;
