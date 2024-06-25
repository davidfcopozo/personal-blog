import User from "../models/userModel";

export async function generateUniqueUsername(
  baseUsername: string
): Promise<string> {
  let username = baseUsername;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
}
