import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarFooter,
} from "../components/ui/sidebar";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

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
