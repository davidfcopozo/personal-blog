export const createUserPayload = (user: any) => {
  return { name: user.name, userId: user._id, role: user.role };
};
