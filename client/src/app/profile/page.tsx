import ProtectedRoute from "@/components/ProtectedRoute";
import Profile from "@/components/profile";


export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
}
