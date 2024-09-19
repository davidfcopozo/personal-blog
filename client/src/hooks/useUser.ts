import useFetchRequest from "./useFetchRequest";

export function useUser(id: string) {
  return useFetchRequest("users", `/api/users/${id}`);
}
