import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import NavBar from "@/components/NavBar";
import { usersApi } from "@/api/users";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context }) => {
    try {
      const queryClient = context.queryClient;
      const data = await queryClient.fetchQuery({
        queryKey: ["getUserDetails"],
        queryFn: usersApi.getUserDetails,
        staleTime: Infinity,
      });
      return data;
    } catch (error) {
      console.error(error);

      return { user: null };
    }
  },
  component: Component,
});

function Component() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  if (!user) {
    navigate({ to: "/sign-in" });
    return null;
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavBar />
        <main>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
