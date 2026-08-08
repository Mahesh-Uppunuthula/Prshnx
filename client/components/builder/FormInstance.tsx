import { BuilderState } from "@/store/builder.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z, ZodAny } from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { Button } from "../ui/button";

function buildFormSchema(nodeMap: BuilderState["pages"][number]["nodes"]) {
  const shape: { [k: string]: z.ZodTypeAny } = {};

  Object.values(nodeMap).forEach((element) => {
    let fieldSchema: z.ZodTypeAny;
    const { type } = element;

    if (type === "container") return;

    const label = type === "chat-block" ? element.question : element.label;

    switch (type) {
      case "single-line-input":
      case "single-line-hidden-input":
        {
          console.log("single-line-input");
          const { minLength, maxLength } = element;
          console.log({ minLength, maxLength });

          fieldSchema = z
            .string({ error: "Required" })
            .min(minLength, {
              error: `${label} must be at least ${minLength} characters long`,
            })
            .max(maxLength, {
              error: `${label} must be at most ${maxLength} characters long`,
            });
        }
        break;

      case "multi-line-input":
        {
          console.log("multi-line-input");
          const { minLength, maxLength } = element;
          fieldSchema = z
            .string({ error: "Required" })
            .min(minLength, {
              error: `${label} must be at least ${minLength} characters long`,
            })
            .max(maxLength, {
              error: `${label} must be at most ${maxLength} characters long`,
            });
        }
        break;
      case "number-input":
        {
          console.log("number-input");
          const { min, max } = element;
          fieldSchema = z.coerce
            .number({ error: "Required" })
            .min(min, {
              error: `${label} min value is ${min}`,
            })
            .max(max, {
              error: `${label} max value is ${max}`,
            });
        }
        break;

      // case "date-input":
      //   {
      //     console.log("date-input");
      //     fieldSchema = z.coerce.date({ error: "Required" });
      //   }
      //   break;
      // case "time-input":
      //   {
      //     console.log("time-input");
      //     fieldSchema = z.string({ error: "Required" });
      //   }
      //   break;

      // case "selection": {
      //   {
      //     console.log("selection");
      //     fieldSchema = z.string({ error: "Required" });
      //   }
      //   break;
      // }

      default:
        fieldSchema = z.unknown();
        break;
    }

    if (!element.required) {
      fieldSchema = (fieldSchema as ZodAny).optional();
    }
    shape[label] = fieldSchema;
  });
  console.log({ shape });

  return z.object(shape);
}

type FormInstanceProps = {
  devMode?: boolean;
  pages: BuilderState["pages"];
  pagesOrder: BuilderState["pagesOrder"];
};
function FormInstance({ devMode, pages, pagesOrder }: FormInstanceProps) {
  const [activePageId, setActivePageId] = useState(
    pagesOrder && pagesOrder.length > 0 ? pagesOrder[0] : undefined,
  );
  const [showThankYouPage, setShowThankYouPage] = useState(false);

  if (!activePageId || !pages[activePageId]) return <div>No Pages to show</div>;

  const formSchema = buildFormSchema(pages[activePageId].nodes);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // TODO allow default values
    // defaultValues: {
    //   title: "",
    //   description: "",
    // },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(data);
  }
  return (
    //  main container
    <div className="w-full h-full flex justify-center place-items-center">
      {/* form container */}
      <div className="w-[70%] h-[95%] bg-card p-2 overflow-y-auto border rounded-lg shadow-lg">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Bug Title
                  </FieldLabel>
                  <Input
                    {...field}
                    value={(field.value as string | number) ?? ""}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Login button not working on mobile"
                    autoComplete="off"
                  />
                  {!!field.value && (
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {(field.value as string).length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      value={(field.value as string) ?? ""}
                      id="form-rhf-demo-description"
                      placeholder="I'm having an issue with the login button on mobile."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    {!!field.value && (
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {(field.value as string).length}/100 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                  <FieldDescription>
                    Include steps to reproduce, expected behavior, and what
                    actually happened.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-rhf-demo">
              Submit
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
}

export default FormInstance;
