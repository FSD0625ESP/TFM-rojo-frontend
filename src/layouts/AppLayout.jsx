import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarFooter,
} from "../components/ui/sidebar";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />

        <main className="flex-grow">
          <Outlet />
        </main>

        <SidebarFooter>
          <Footer />
        </SidebarFooter>
      </SidebarInset>
    </SidebarProvider>
  );
}
