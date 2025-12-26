import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query";
import GenericError from "@/pages/Error/GenericError";
import NotFound from "@/pages/Error/NotFound";
import { Toaster } from "@/components/ui/sonner";
interface RouterContext {
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: () => <GenericError />,
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Toaster />
      <React.Fragment>
        <Outlet />
      </React.Fragment>
    </>
  );
}
