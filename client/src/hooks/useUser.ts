import useFetchRequest from "./useFetchRequest";

export function useUser(id: string) {
  return useFetchRequest("postedBy", `/api/users/${id}`);
}
