import ProtectedRoute from "@/components/ProtectedRoute";
import { Settings } from "@/components/settings";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  );
}
