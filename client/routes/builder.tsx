import BuilderBodyLayout from "@/components/builder/Layout";
import NavigationBar from "@/components/builder/NavigationBar";
import QuickActionBar from "@/components/builder/QuickActionsBar";
import { BuilderProvider } from "@/context/BuilderProvider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/builder")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <BuilderProvider initialBuilderState={undefined}>
      <Builder />
    </BuilderProvider>
  );
}

function Builder() {
  return (
    <div className="w-screen h-screen p-1">
      <NavigationBar />
      <BuilderBodyLayout />
      <div className="fixed bottom-1 left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <QuickActionBar />
      </div>
    </div>
  );
}
