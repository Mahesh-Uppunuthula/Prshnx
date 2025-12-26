import FormCard from "@/components/FormCard";

import { useForms } from "@/hooks/use-forms";
import Show from "@/components/utils/Show";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_protected/forms/")({
  component: Forms,
});

function Forms() {
  const { data: formData, isPending, error } = useForms();

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Show
      when={Array.isArray(formData) && formData.length > 0}
      fallback={<EmtpyPage />}
    >
      {/* parent */}
      <section className="py-1 px-3 h-screen">
        {/* container  */}
        <div className="w-full h-full flex flex-col gap-4">
          <nav className="w-full h-[7%] px-2 flex justify-between place-items-center">
            <h1 className="text-xl font-medium">Forms</h1>
            <Link to={"/form-builder"}>
              <Button size={"sm"} className="rounded">
                <Plus />
                Form
              </Button>
            </Link>
          </nav>
          <div className="w-full h-[93%] p-2 flex flex-wrap gap-8 overflow-y-auto">
            {/* TODO - fix this isArray thing */}
            {Array.isArray(formData) &&
              formData.map((form) => <FormCard form={form} />)}
          </div>
        </div>
      </section>
    </Show>
  );
}

function EmtpyPage() {
  return (
    <div className="w-full h-screen flex justify-center place-items-center-safe">
      {/* container */}
      <div className="h-fit flex flex-col gap-2 text-center">
        {/* Meh emoji */}
        <div
          role="img"
          className="w-full flex justify-center place-items-center my-5"
        >
          <span className="inline-block align-top">
            {/* <Meh className="size-40 fill-muted-foreground/10 text-muted-foreground/50" /> */}
            <FolderOpen className="size-20" strokeWidth={1} />
          </span>
        </div>
        <div className="flex flex-col place-items-center gap-2">
          {/* title */}
          <h2 className="text-2xl font-semibold">No forms yet</h2>
          {/* description */}
          <p className="w-[60%] text-balance text-muted-foreground ">
            Looks like you haven&apos;t created any forms yet, click on the
            button to create your first one.
          </p>
        </div>
        <div className="my-2">
          <Link to={"/form-builder"}>
            <Button>
              <Plus /> Create new form
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
