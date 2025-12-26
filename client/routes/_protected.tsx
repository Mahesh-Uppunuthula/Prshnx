import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import NavBar from "@/components/NavBar";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context }) => {
    try {
      const queryClient = context.queryClient;
      const data = await queryClient.fetchQuery(
        userQueryOptions.getUserDetails
      );

      console.log({ data });
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
