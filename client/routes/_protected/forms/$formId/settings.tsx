import FormStepperDemo from "@/components/FormStepperDemo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/forms/$formId/settings")({
  component: Settings,
});

function Settings() {
  const { formId } = Route.useParams();
  console.log({ formId });
  return <div>
    {/* settings */}
    <FormStepperDemo formId={formId} />
  </div>;
}
