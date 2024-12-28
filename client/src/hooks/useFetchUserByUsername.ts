import useFetchRequest from "./useFetchRequest";

export function useFetchUserByUsername(username: string) {
  return useFetchRequest(
    [`user-${username}`],
    `/api/users/username/${username}`
  );
}
