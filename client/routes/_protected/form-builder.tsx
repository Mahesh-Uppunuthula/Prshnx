import NavBar, { NavBarMobileTrigger } from "@/components/NavBar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cn, createFirstPageScreenShot } from "@/lib/utils";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  Mailbox,
  MessageSquareQuote,
  Plus,
  Star,
  User,
} from "lucide-react";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { Button } from "@/components/ui/button";
import Switch from "@/components/utils/Switch";
import InlineEdit from "@/components/custom/InlineEdit";
import FormPlayground from "@/pages/FormPlayground";
import Show from "@/components/utils/Show";
import FormPreview from "@/pages/FormPreview";
import { useMultiPageFormBuilder } from "@/store/form-builder.store";
import { useSaveForm } from "@/hooks/use-forms";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { toStructuredPages } from "@/lib/helper";
import { useNavigate } from "@tanstack/react-router";
export const Route = createFileRoute("/_protected/form-builder")({
  component: FormBuilder,
  pendingComponent: () => <div>page loading...</div>,
});

const sections = {
  "form-builder": 0,
  playground: 1,
};

function FormBuilder() {
  // hooks
  const navigate = useNavigate();

  // mutations
  const { isPending: savingForm, mutate: saveForm } = useSaveForm();

  // refs
  const formRef = useRef<HTMLDivElement>(null);

  // local states
  const [section, setSection] = useState<number>(sections["playground"]);
  const [preview, setPreview] = useState<boolean>(false);

  // router
  const { pathname } = useLocation();
  const currentPath = pathname.split("/")[1];

  // store states
  const formTitle = useMultiPageFormBuilder((s) => s.title);
  const pages = useMultiPageFormBuilder((s) => s.pages);
  const pageSettings = useMultiPageFormBuilder((s) => s.pageSettings);

  const setTitle = useMultiPageFormBuilder((s) => s.setTitle);
  const setActivePageId = useMultiPageFormBuilder((s) => s.setActivePageId);
  const setActiveFormElement = useMultiPageFormBuilder(
    (s) => s.setActiveFormElement
  );

  // hooks
  // const activePage = useActivePage();

  // computed states
  // const activePageElements = activePage.body.elements;
  const firstPageId = pages.keys().next().value!;
  const firstPageHasElements = pages.get(firstPageId)!.body.elements.length > 0;

  const isFormEmpty = useMemo(() => {
    for (const page of pages.values()) {
      if (page.body.elements.length > 0) return false;
    }
    return true;
  }, [pages]);

  const handleSectionUpdate = useCallback(
    (sectionId: number) => () => {
      setSection(sectionId);
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!formRef || !formRef.current) return;

    // set first page for preview
    setActivePageId(pages.keys().next().value!);
    setActiveFormElement("dummy-id", "cta");

    // create the form preview screenshot
    const formPreviewResponse = firstPageHasElements
      ? await createFirstPageScreenShot(formRef)
      : null;

    const formData = new FormData();
    formData.append(
      "form",
      JSON.stringify(toStructuredPages(formTitle, pageSettings, pages))
    );
    if (formPreviewResponse && formPreviewResponse.success)
      formData.append(
        "preview",
        formPreviewResponse.data,
        `${formTitle}_preview.png`
      );

    saveForm(formData, {
      onSuccess: () => {
        toast.success("Form saved successfully", {
          closeButton: true,
          description: "asdfasf asdfasdf asfas",
        });
        navigate({ to: "/forms" });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }, [
    firstPageHasElements,
    formTitle,
    navigate,
    pageSettings,
    pages,
    saveForm,
    setActiveFormElement,
    setActivePageId,
  ]);

  return (
    <Show
      when={!preview}
      fallback={<FormPreview goBack={() => setPreview(false)} />}
    >
      <section className="py-1 px-3 h-screen">
        <NavBar className="h-[7%] flex place-items-center gap-2 justify-between">
          <div>
            <NavBarMobileTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem
                  className={cn({
                    "text-foreground": section === sections["form-builder"],
                  })}
                  onClick={handleSectionUpdate(sections["form-builder"])}
                >
                  <BreadcrumbLink asChild>
                    <Link to={pathname}>
                      <span className="capitalize">{currentPath}</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {section > sections["form-builder"] && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        <InlineEdit
                          className="max-w-80"
                          placeholder={formTitle}
                          value={formTitle}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-2 place-items-center">
            <Button
              size="sm"
              variant={"secondary"}
              className="rounded"
              disabled={isFormEmpty}
              onClick={() => setPreview(true)}
            >
              <Eye /> Preview
            </Button>
            <Button
              size="sm"
              className="rounded"
              disabled={isFormEmpty || savingForm}
              onClick={handleSave}
            >
              {savingForm && <Spinner />}
              Save
            </Button>
            <Button size="sm" className="rounded" disabled={isFormEmpty}>
              Publish
            </Button>
          </div>
        </NavBar>
        <div className="h-[93%] w-full">
          <Switch
            when={section}
            cases={{
              [sections["form-builder"]]: (
                <TemplateSelection
                  onSubmit={handleSectionUpdate(sections.playground)}
                />
              ),
              [sections["playground"]]: <FormPlayground formRef={formRef} />,
            }}
            fallback={<div>invalid step</div>}
          />
        </div>
      </section>
    </Show>
  );
}

type TemplateSelectionProps = {
  onSelect?: (template: string) => void;
  onSubmit?: () => void;
};

type TemplateOption = {
  title: string;
  id: "blank" | "feedback" | "rating" | "contact" | "newsletter";
  description: string;
  avatar: ReactElement;
  tags: string[];
};

const teamplateOptions: TemplateOption[] = [
  {
    title: "Start from Scratch",
    id: "blank",
    description:
      "Build your own form from scratch and customize it to your needs.",
    tags: ["blank", "default"],
    avatar: (
      <div className="w-9 rounded aspect-square text-muted-foreground bg-muted flex justify-center place-items-center">
        <Plus />
      </div>
    ),
  },
  {
    title: "Feedback Form",
    id: "feedback",
    description: "Template for collecting feedback from your users",
    tags: ["feedback", "survey"],
    avatar: (
      <div className="w-9 rounded aspect-square bg-blue-400 text-foreground flex justify-center place-items-center">
        <MessageSquareQuote className="fill-white" />
      </div>
    ),
  },
  {
    title: "Rating Form",
    id: "rating",
    description: "Template for collecting ratings from your users",
    tags: ["rating", "stars"],
    avatar: (
      <div className="w-9 rounded aspect-square bg-purple-400 flex justify-center place-items-center">
        <Star className="fill-orange-300" />
      </div>
    ),
  },
  {
    title: "Contact Form",
    id: "contact",
    description: "Template for collecting contact information from your users",
    tags: ["contact", "email"],
    avatar: (
      <div className="w-9 rounded aspect-square bg-amber-400 flex justify-center place-items-center">
        <User className="text-foreground" />
      </div>
    ),
  },
  {
    title: "Newsletter Form",
    id: "newsletter",
    description: "Template for collecting email addresses from your users",
    tags: ["newsletter", "email"],
    avatar: (
      <div className="w-9 rounded aspect-square bg-emerald-400 flex justify-center place-items-center">
        <Mailbox className="fill-white" />
      </div>
    ),
  },
];
const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  onSelect,
  onSubmit,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    TemplateOption["id"] | null
  >(null);

  const handleSelection = useCallback(
    (templateId: TemplateOption["id"]) => () => {
      setSelectedTemplate(templateId);
      if (onSelect) onSelect(templateId);
    },
    [onSelect]
  );

  return (
    <div>
      <div className="w-full flex justify-between place-items-center my-2">
        <h1 className="font-medium my-2">Template Selection</h1>
        <Button
          size={"sm"}
          disabled={selectedTemplate === null}
          onClick={onSubmit}
        >
          <span className="hidden md:block">Next</span>
          <ArrowRight />
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <RadioGroup value={selectedTemplate}>
          <div className="flex flex-wrap gap-4">
            {teamplateOptions.map((template) => (
              <Card
                className={cn(
                  "w-full h-40 hover:shadow-lg transition-shadow max-w-xs group",
                  {
                    "ring-1 ring-foreground/20":
                      template.id === selectedTemplate,
                  }
                )}
                onClick={handleSelection(template.id)}
              >
                <div className="w-full px-2 flex place-items-start gap-3">
                  <div>{template.avatar}</div>
                  <div>
                    <CardTitle>{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <CardAction className="ml-auto">
                    <RadioGroupItem value={template.id} id={template.id} />
                  </CardAction>
                </div>
                <CardFooter>
                  <Button variant={"link"}>preview </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
