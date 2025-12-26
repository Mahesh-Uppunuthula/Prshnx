import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/forms/$formId/settings")({
  component: Settings,
});

function Settings() {
  return <div>Settings</div>;
}
