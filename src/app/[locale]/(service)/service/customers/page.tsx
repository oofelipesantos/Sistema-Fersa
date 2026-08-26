import { OrganizationManagement } from "@/components/service/organization-management";
import { ProtectedRoute } from "@/features/auth/protected-route";

export default function OrganizationsPage() {
  return (
    <ProtectedRoute roles={["SUPPORT", "ADMIN"]}>
      <OrganizationManagement />
    </ProtectedRoute>
  );
}
