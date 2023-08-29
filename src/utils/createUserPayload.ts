import { UserType } from "../typings/types";

export const createUserPayload = (user: UserType) => {
  return { firstName: user?.firstName, userId: user?._id, role: user?.role };
};
