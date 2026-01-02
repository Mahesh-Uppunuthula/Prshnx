import { z, ZodAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MultiPageForm,
  // useActivePage,
  useMultiPageFormBuilder,
} from "@/store/form-builder.store";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import type {
  DateInputElement,
  DateInputProperties,
  FormElement,
  MultiLineInputElement,
  NumberInputElement,
  SelectionElement,
  SelectionProperties,
  SingleLineInputElement,
  TimeInputElement,
} from "@/types/form-builder.types";
import Switch from "./utils/Switch";
import { DatePicker } from "./ui/date-picker";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import type { DateInterval, DateRange } from "react-day-picker";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import Show from "./utils/Show";
import { Check, Hexagon, LucideTextCursorInput } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { Link } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FakeToggle } from "./create-choice-labels";
import { getAlphabetPrefix } from "@/lib/helper";
import { FormConfiguration } from "@/types/form.types";

function renderChoice(
  choice: SelectionProperties["choiceLabels"][0],
  optionPrefix: SelectionProperties["optionPrefix"],
  index: number
) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        when={optionPrefix}
        cases={{
          alphabet: <FakeToggle content={getAlphabetPrefix(index)} />,
          number: <FakeToggle content={index + 1} />,

          default: null,
          none: null,
        }}
      />

      <span>{choice}</span>
    </div>
  );
}

function buildFormSchema(elements: FormElement[]) {
  const shape: { [k: string]: unknown } = {};

  elements.forEach((element) => {
    let fieldSchema: unknown;
    const { properties, type } = element;
    const { label } = properties;
    switch (type) {
      case "single-line-input":
        {
          console.log("single-line-input");
          const { minLength, maxLength } = element.properties;
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
          const { minLength, maxLength } = element.properties;
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
          const { min, max } = element.properties;
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

      case "date-input":
        {
          console.log("date-input");
          fieldSchema = z.coerce.date({ error: "Required" });
        }
        break;
      case "time-input":
        {
          console.log("time-input");
          fieldSchema = z.string({ error: "Required" });
        }
        break;

      case "selection": {
        {
          console.log("selection");
          fieldSchema = z.string({ error: "Required" });
        }
        break;
      }

      default:
        fieldSchema = z.unknown();
        break;
    }

    if (!element.properties.required) {
      fieldSchema = (fieldSchema as ZodAny).optional();
    }
    shape[label] = fieldSchema;
  });
  console.log({ shape });

  return z.object(shape);
}

// function getDefaultValue(type: FormElement["type"]) {
//   switch (type) {
//     // case "single-line-input":
//     //   return "";
//     // case "multi-line-input":
//     //   return "";
//     // case "number-input":
//     //   return 0;
//     // case "date-input":
//     //   return new Date();
//     // case "time-input":
//     //   return "";
//     // default:
//     //   return "";
//   }
// }

function getDatePickerDisabledDates(
  restrictDate: DateInputProperties["restrictDate"],
  dateRange: DateInputProperties["dateRange"]
): DateRange | DateInterval | undefined {
  if (!dateRange || dateRange.from === undefined || dateRange.to === undefined)
    return undefined;
  switch (restrictDate) {
    case "no-restriction":
      return undefined;

    case "allow-specific-dates":
      return { before: dateRange.from, after: dateRange.to } as DateInterval;

    case "exclude-specific-dates":
      return { from: dateRange.from, to: dateRange.to } as DateRange;

    default:
      return undefined;
  }
}

type FormInstanceProps = {
  devMode: boolean;
  configuration: FormConfiguration
}

export default function FormInstance({ configuration, devMode }: FormInstanceProps) {
  // const pageSettings = useMultiPageFormBuilder((s) => s.pageSettings);
  // const pages = useMultiPageFormBuilder((s) => s.pages);
  const pages = configuration.pages;
  const settings = configuration.settings;

  const pagesIds = useMemo(() => {
    return pages.map((page) => page.id);
  }, [pages]);

  const [activePageIdx, setActivePageIdx] = useState(() => {
    console.log("setting activePageIdx");
    return 0;
  });
  const [showThankYouPage, setShowThankYouPage] = useState(false);

  // const activePage = pages.get(pagesIds[activePageIdx])!;
  const activePage = useMemo(() => {
    return pages.find((page) => page.id === pagesIds[activePageIdx])!;
  }, [pages, pagesIds, activePageIdx]);

  const elements = activePage.body.elements!;

  // const activePage = useActivePage();
  // const elements = activePage.body.elements;
  const formSchema = buildFormSchema(elements);

  const defaultValues = Object.fromEntries(
    elements.map((element) => [
      element.properties.label,
      // getDefaultValue(element.type),
    ])
  );
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const hasErrors = Object.keys(form.formState.errors).length > 0;

  console.log({ hasErrors });

  const goToNextPage = useCallback(() => {
    setActivePageIdx((prev) => {
      if (prev === pagesIds.length - 1) {
        setShowThankYouPage(true);
        return prev;
      }
      return prev + 1;
    });
  }, [pagesIds.length]);

  const handleContinue = useCallback(() => {
    if (!devMode) return;
    form.clearErrors();
    goToNextPage();
  }, [form, goToNextPage]);

  const onSubmit = useCallback(() => {
    goToNextPage();
  }, [goToNextPage]);

  return (
    // container
    <div className="w-full h-full flex justify-center place-items-center">
      {/* form container */}
      <div
        className="w-full min-w-fit max-w-1/2 min-h-1/2 h-[98%] p-4 flex flex-col justify-center border 
        rounded shadow-xl"
      >
        <Show when={!showThankYouPage} fallback={<></>}>
          <div>
            {/* page cover */}
            {settings.cover && (
              <div className="w-full h-fit relative group">
                <img
                  className="w-full aspect-video max-h-40 bg-center object-cover"
                  // src={"public/images/sample-banner-2.webp"}
                  src={"/images/smiely_face.png"}
                />
              </div>
            )}
            {/* page logo */}
            {settings.logo && (
              <div
                className={cn("w-full h-fit min-h-10 relative pl-2", {
                  "min-h-20": !settings.cover,
                })}
              >
                <div
                  className={cn(
                    "w-20 h-20 group absolute top-[-100%] ml-[15%] flex justify-center place-items-center p-2 bg-black text-white rounded-full",
                    {
                      "top-0 ml-0": !settings.cover,
                    }
                  )}
                >
                  <Hexagon size={32} />
                </div>
              </div>
            )}
          </div>
        </Show>
        <Show when={!showThankYouPage} fallback={<ThankYouPage devMode={devMode} />}>
          <Form key={activePage.id} {...form}>
            <form
              className="w-full max-w-[98%] h-full max-h-[95%] p-2 overflow-auto flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div>
                <div className="text-lg">{activePage.header.title}</div>
                <div
                  className={cn("text-xs mb-2", {
                    hidden: activePage.header.description.trim().length === 0,
                  })}
                >
                  {activePage.header.description}
                </div>
              </div>

              {elements.map((element) => (
                <Switch
                  when={element.type}
                  cases={{
                    "single-line-input": () => {
                      const {
                        description,
                        label,
                        showDescription,
                        placeholder,
                        required,
                      } = (element as SingleLineInputElement).properties;
                      return (
                        <FormField
                          control={form.control}
                          name={label}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {label}
                                {required && (
                                  <span className="text-red-500 font-medium">
                                    *
                                  </span>
                                )}
                              </FormLabel>
                              {showDescription && (
                                <FormDescription className="text-xs">
                                  {description}
                                </FormDescription>
                              )}
                              <FormControl>
                                <Input
                                  key={label}
                                  className="rounded"
                                  placeholder={placeholder}
                                  type="text"
                                  {...field}
                                  value={field.value as string}
                                />
                              </FormControl>

                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      );
                    },
                    "multi-line-input": () => {
                      const {
                        description,
                        label,
                        showDescription,
                        placeholder,
                        required,
                      } = (element as MultiLineInputElement).properties;
                      return (
                        <FormField
                          control={form.control}
                          name={label}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {label}{" "}
                                {required && (
                                  <span className="text-red-500 font-medium">
                                    *
                                  </span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  key={element.id}
                                  placeholder={placeholder}
                                  className="resize-none"
                                  {...field}
                                  value={field.value as string}
                                />
                              </FormControl>
                              {showDescription && (
                                <FormDescription className="text-xs">
                                  {description}
                                </FormDescription>
                              )}
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      );
                    },
                    "number-input": () => {
                      const {
                        description,
                        label,
                        showDescription,
                        placeholder,
                        required,
                      } = (element as NumberInputElement).properties;
                      return (
                        <FormField
                          control={form.control}
                          name={label as string}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {label}
                                {required && (
                                  <span className="text-red-500 font-medium">
                                    *
                                  </span>
                                )}
                              </FormLabel>
                              {showDescription && (
                                <FormDescription className="text-xs">
                                  {description}
                                </FormDescription>
                              )}
                              <FormControl>
                                <Input
                                  className="rounded"
                                  key={element.id}
                                  {...field}
                                  type={"number"}
                                  placeholder={placeholder}
                                  value={
                                    field.value as unknown as number | undefined
                                  }
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      );
                    },
                    "date-input": () => {
                      const {
                        description,
                        label,
                        showDescription,
                        disabled,
                        placeholder,
                        dateRange,
                        restrictDate,
                        required,
                      } = (element as DateInputElement).properties;
                      return (
                        <FormField
                          control={form.control}
                          name={label}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {label}{" "}
                                {required && (
                                  <span className="text-red-500 font-medium">
                                    *
                                  </span>
                                )}
                              </FormLabel>
                              {showDescription && (
                                <FormDescription className="text-xs">
                                  {description}
                                </FormDescription>
                              )}
                              <FormControl>
                                <DatePicker
                                  className="rounded"
                                  mode="single"
                                  disableField={disabled}
                                  disabled={getDatePickerDisabledDates(
                                    restrictDate,
                                    dateRange
                                  )}
                                  placeholder={placeholder}
                                  selected={
                                    field.value as unknown as Date | undefined
                                  }
                                  onSelect={field.onChange}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      );
                    },
                    "time-input": () => {
                      const {
                        description,
                        label,
                        showDescription,
                        placeholder,
                        required,
                      } = (element as TimeInputElement).properties;
                      return (
                        <FormField
                          control={form.control}
                          name={label}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {label}
                                {required && (
                                  <span className="text-red-500 font-medium">
                                    *
                                  </span>
                                )}{" "}
                              </FormLabel>
                              {showDescription && (
                                <FormDescription className="text-xs">
                                  {description}
                                </FormDescription>
                              )}
                              <FormControl>
                                <Input
                                  className="rounded"
                                  type="time"
                                  placeholder={placeholder}
                                  {...field}
                                  value={field.value as string}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      );
                    },
                    selection: () => {
                      const {
                        description,
                        label,
                        showDescription,
                        required,
                        placeholder,
                        choiceLabels,
                        optionPrefix,
                      } = (element as SelectionElement).properties;
                      return (
                        <FormField
                          control={form.control}
                          name={label as string}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {label}
                                {required && (
                                  <span className="text-red-500 font-medium">
                                    *
                                  </span>
                                )}{" "}
                              </FormLabel>
                              {showDescription && (
                                <FormDescription className="text-xs">
                                  {description}
                                </FormDescription>
                              )}
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue
                                      placeholder={
                                        placeholder.trim().length > 0
                                          ? placeholder
                                          : "Select an option"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <Show
                                      when={choiceLabels.length > 0}
                                      fallback={
                                        <div className="w-full h-10 flex justify-center place-items-center text-sm italic text-muted-foreground">
                                          No options provided
                                        </div>
                                      }
                                    >
                                      <SelectGroup>
                                        {choiceLabels.map((choice, idx) => (
                                          <SelectItem value={choice}>
                                            {renderChoice(
                                              choice,
                                              optionPrefix,
                                              idx
                                            )}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </Show>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      );
                    },
                  }}
                  fallback={<div>fallback field</div>}
                />
              ))}
              <Button className="mt-5" type="submit">
                {activePage.action.cta.label}
              </Button>
              {devMode && hasErrors && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      className="w-full"
                      type="button"
                      variant="secondary"
                      onClick={handleContinue}
                    >
                      Continue Anyway
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Available only in preview mode to test your form
                  </TooltipContent>
                </Tooltip>
              )}
            </form>
          </Form>
        </Show>
      </div>
    </div>
  );
}

function FormElement() {
  return <Input />;
}

function ThankYouPage({ devMode }: { devMode: boolean }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-5 rounded">
      {/* Success Icon */}
      <div className="bg-cyan-100 p-4 rounded-full mb-6">
        <Check className="text-cyan-500 w-8 h-8" strokeWidth={3} />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
        Thanks for completing this form!
      </h1>

      {/* Subtext */}
      <p className="text-gray-500 text-sm mb-6 text-center">
        Made with <span className="font-medium">{BRAND.name}</span>, the modern
        way to create forms for free.
      </p>

      <Tooltip>
        <TooltipTrigger>
          <Link to={"/"} target="blank">
            <Button variant={"secondary"}>
              <span className="bg-primary p-1 rounded">
                <LucideTextCursorInput className="size-4 text-primary-foreground" />
              </span>
              Create your own form
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent hidden={!devMode} side="bottom">
          You can remove {BRAND.name} branding by upgrading to {BRAND.name} pro
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
