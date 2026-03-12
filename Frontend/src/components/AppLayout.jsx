import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { UploadProvider } from "@/context/UploadContext";

export function AppLayout() {
  return (
    <UploadProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <main className="ml-60">
          <Outlet />
        </main>
      </div>
    </UploadProvider>
  );
}
