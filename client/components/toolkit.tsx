import { memo, useMemo, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SwitchComponents from "@/components/utils/Switch";
import {
  useActivePage,
  // useMultiPageFormBuilder,
} from "@/store/form-builder.store";
import { useMultiPageFormStore } from "@/context/MultiPageFormProvider";
import type {
  BaseFieldProperties,
  ComponentVariants,
  DateInputElement,
  DateInputProperties,
  FieldPropertyName,
  FormElement,
  Page,
  PageCTA,
  PrimitiveFieldProperties,
  PrimitiveFields,
  SelectionProperties,
  TimeInputProperties,
} from "@/types/form-builder.types";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { isDateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * TODO
 * Min and Max for number input needs validation min < max
 */

const DatePickerRestrictionOptions: {
  label: string;
  value: DateInputProperties["restrictDate"];
}[] = [
  {
    label: "No Restriction",
    value: "no-restriction",
  },
  {
    label: "Allow Specific Dates",
    value: "allow-specific-dates",
  },
  {
    label: "Exclude Specific Dates",
    value: "exclude-specific-dates",
  },
] as const;

const SelectionTypeOptions: {
  label: string;
  value: SelectionProperties["optionPrefix"];
}[] = [
  {
    label: "None",
    value: "none",
  },
  {
    label: "Default",
    value: "default",
  },
  {
    label: "Alphabet",
    value: "alphabet",
  },
  {
    label: "Number",
    value: "number",
  },
] as const;

const PageCtaBackgroundOptions: {
  label: string;
  value: PageCTA["background"]["type"];
}[] = [
  {
    label: "Color",
    value: "color",
  },
  {
    label: "Gradient",
    value: "gradient",
  },
  {
    label: "Image",
    value: "image",
  },
] as const;

const PageCtaBorderRadiusOptions: {
  label: string;
  value: PageCTA["borderRadius"];
}[] = [
  {
    label: "Small",
    value: "small",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "Large",
    value: "large",
  },
] as const;

const PageCtaAlignmentOptions: {
  label: string;
  value: PageCTA["alignment"];
}[] = [
  {
    label: "Left",
    value: "left",
  },
  {
    label: "Center",
    value: "center",
  },
  {
    label: "Right",
    value: "right",
  },
  {
    label: "Full",
    value: "full",
  },
] as const;

const FORM_ELEMENT_INACCESIBLE_PROPERTIES = new Set<Partial<FieldPropertyName>>(
  ["disabled", "order"]
);

const CTA_INACCESIBLE_PROPERTIES = new Set<keyof Partial<PageCTA>>([
  "actionType",
  "type",
]);

function getHumanReadableElementType(
  type: ComponentVariants | PageCTA["type"]
) {
  switch (type) {
    case "single-line-input":
      return "Single Line Input";
    case "multi-line-input":
      return "Multi Line Input";
    case "number-input":
      return "Number Input";
    case "date-input":
      return "Date Input";
    case "time-input":
      return "Time Input";
    case "cta":
      return "Call to Action";
    // case "checkbox":
    //   return "Checkbox";
    // case "radio-button":
    //   return "Radio";
    default:
      return type;
  }
}

const getHumanReadablePropertyName = (name: FieldPropertyName) => {
  switch (name) {
    case "minLength":
      return "Min Length";
    case "maxLength":
      return "Max Length";

    case "restrictDate":
      return "Restrict Date";

    case "restrictTime":
      return "Restrict Time";

    case "from":
      return "From";
    case "to":
      return "To";

    case "choiceLabels":
      return "Choice Labels";

    case "showDescription":
      return "Show Description";

    case "dateRange":
      return "Date Range";

    case "selectionType":
      return "Selection Type";
    case "optionPrefix":
      return "Choice Prefix";
    default:
      return name;
  }
};

/**
 *
 * TODO
 * Add time picker component
 */

function Toolkit() {
  // const _activeFormElement = useActiveFormElement(
  //   (state) => state.activeFormElement
  // );

  const activePageId = useMultiPageFormStore((s) => s.activePageId);
  const pages = useMultiPageFormStore((s) => s.pages);

  const activeFormElement = useMultiPageFormStore((s) => s.activeFormElement);
  const updatePageAction = useMultiPageFormStore((s) => s.updatePageAction);

  const updatePageElementProperties = useMultiPageFormStore(
    (s) => s.updatePageElementProperties
  );
  const activePage = useActivePage();

  const elements = activePage.body.elements;

  const validActiveFormElement:
    | FormElement
    | Page["action"]["cta"]
    // |  Add page configuration panel
    | undefined = useMemo(() => {
    if (!activeFormElement) return undefined;
    if (activeFormElement.type === "cta")
      return pages.get(activePageId)!.action.cta as Page["action"]["cta"];
    return elements.find((item) => item.id === activeFormElement?.id) as
      | FormElement
      | undefined;
  }, [activeFormElement, activePageId, elements, pages]);

  if (!activeFormElement || !validActiveFormElement) return <EmptyPage />;

  const getFormElementProperty = (propertyName: FieldPropertyName) => {
    const formElement = validActiveFormElement as FormElement;
    if (
      propertyName in formElement.properties === false ||
      FORM_ELEMENT_INACCESIBLE_PROPERTIES.has(propertyName)
    )
      return null;

    switch (propertyName) {
      case "label":
      case "placeholder": {
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">
              {getHumanReadablePropertyName(propertyName)}
            </Label>
            <Input
              key={propertyName}
              type="text"
              value={
                (formElement.properties as BaseFieldProperties)[propertyName]
              }
              placeholder={propertyName}
              onChange={(e) => {
                const value = e.target.value;
                console.log({ value });
                updatePageElementProperties(formElement.id, {
                  [propertyName]: value,
                });
              }}
            />
          </div>
        );
      }
      case "description":
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">
              {getHumanReadablePropertyName(propertyName)}
            </Label>
            <Textarea
              className="w-full resize-none"
              key={propertyName}
              value={
                (formElement.properties as BaseFieldProperties)[propertyName]
              }
              placeholder={propertyName}
              onChange={(e) => {
                const value = e.target.value;
                console.log({ value });
                updatePageElementProperties(formElement.id, {
                  [propertyName]: value,
                });
              }}
            />
          </div>
        );

      case "disabled":
      case "required":
      case "showDescription": {
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">
              {getHumanReadablePropertyName(propertyName)}
            </Label>
            <Switch
              checked={formElement.properties[propertyName]}
              onCheckedChange={(value) => {
                updatePageElementProperties(formElement.id, {
                  [propertyName]: value,
                });
              }}
            />
          </div>
        );
      }
      case "max": {
        if (!("max" in formElement.properties)) return;
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">
              {getHumanReadablePropertyName(propertyName)}
            </Label>

            <Input
              key={propertyName}
              type="number"
              value={formElement.properties[propertyName] as number}
              onChange={(e) => {
                const value = Number(e.target.value);
                updatePageElementProperties(formElement.id, {
                  max: value,
                });
              }}
            />
          </div>
        );
      }

      case "min": {
        if (!("min" in formElement.properties)) return;
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">
              {getHumanReadablePropertyName(propertyName)}
            </Label>

            <Input
              key={propertyName}
              type="number"
              value={formElement.properties[propertyName] as number}
              onChange={(e) => {
                const value = Number(e.target.value);
                updatePageElementProperties(formElement.id, {
                  min: value,
                });
              }}
            />
          </div>
        );
      }

      case "minLength": {
        if (!("minLength" in formElement.properties)) return;
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">
              {getHumanReadablePropertyName(propertyName)}
            </Label>

            <Input
              key={propertyName}
              type="number"
              value={formElement.properties["minLength"] as number}
              onChange={(e) => {
                const value = Number(e.target.value);
                updatePageElementProperties(formElement.id, {
                  minLength: Math.max(Math.min(value, 256), 0),
                });
              }}
            />
          </div>
        );
      }
      case "maxLength": {
        if (!("maxLength" in formElement.properties)) return;
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">
              {getHumanReadablePropertyName(propertyName)}
            </Label>
            <Input
              key={propertyName}
              type="number"
              value={formElement.properties[propertyName] as number}
              onChange={(e) => {
                const value = Number(e.target.value);
                updatePageElementProperties(formElement.id, {
                  maxLength: Math.max(Math.min(value, 256), 0),
                });
              }}
            />
          </div>
        );
      }

      case "restrictDate": {
        if (!("restrictDate" in formElement.properties)) return;
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">
              {getHumanReadablePropertyName(propertyName)}
            </Label>
            {/* <Switch
              checked={
                (formElement.properties as DateInputProperties)[
                  "restrictDate"
                ]
              }
              onCheckedChange={(value) => {
                updatePageElementProperties(formElement.id, {
                  [propertyName]: value,
                });
              }}
            /> */}
            <Select
              value={formElement.properties.restrictDate}
              onValueChange={(value) => {
                console.log({ value });
                updatePageElementProperties(formElement.id, {
                  restrictDate: value as DateInputProperties["restrictDate"],
                });
              }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Restrict Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Date Restriction</SelectLabel>
                  {DatePickerRestrictionOptions.map((option) => (
                    <SelectItem value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      }
      case "restrictTime":
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">
              {getHumanReadablePropertyName(propertyName)}
            </Label>
            <Switch
              checked={
                (formElement.properties as TimeInputProperties)["restrictTime"]
              }
              onCheckedChange={(value) => {
                updatePageElementProperties(formElement.id, {
                  [propertyName]: value,
                });
              }}
            />
          </div>
        );

      case "dateRange": {
        if (
          (formElement as DateInputElement).properties.restrictDate ===
          "no-restriction"
        )
          return;

        return (
          <div className="mb-2 mt-1">
            <div className="w-full">
              <Label className="mb-1 mx-1">
                {getHumanReadablePropertyName(propertyName)}
              </Label>
              <DatePicker
                pagedNavigation
                mode="range"
                selected={
                  (formElement as DateInputElement).properties.dateRange
                }
                onSelect={(date: unknown) => {
                  console.log({ date });

                  console.log("is date", date);
                  updatePageElementProperties(formElement.id, {
                    dateRange: isDateRange(date) ? date : undefined,
                  });
                }}
                captionLayout="dropdown"
                header={
                  <div>
                    <div className="w-full pt-3 pb-2 text-foreground flex gap-2 justify-center place-items-center">
                      <CalendarIcon className="size-4" />
                      Select date range
                    </div>
                  </div>
                }
                footer={
                  (formElement as DateInputElement).properties.dateRange && (
                    <div className="w-full pt-2 flex justify-center place-items-center">
                      <Button
                        variant={"link"}
                        onClick={() => {
                          updatePageElementProperties(formElement.id, {
                            dateRange: undefined,
                          });
                        }}>
                        clear selection
                      </Button>
                    </div>
                  )
                }
              />
            </div>
          </div>
        );
      }

      case "from": {
        if (
          !("from" in formElement.properties) ||
          !formElement.properties.restrictTime
        )
          return;

        return (
          <div className="mb-2 mt-1">
            <div className="w-full">
              <Label className="mb-1 mx-1">
                {getHumanReadablePropertyName(propertyName)}
              </Label>
              <Input
                type="time"
                value={formElement.properties.from}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  updatePageElementProperties(formElement.id, {
                    from: value,
                  });
                }}
              />
            </div>
          </div>
        );
      }
      case "to": {
        if (
          !("to" in formElement.properties) ||
          !formElement.properties.restrictTime
        )
          return;

        return (
          <div className="mb-2 mt-1">
            <div className="w-full">
              <Label className="mb-1 mx-1">
                {getHumanReadablePropertyName(propertyName)}
              </Label>
              <Input
                type="time"
                value={formElement.properties.to}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  updatePageElementProperties(formElement.id, {
                    to: value,
                  });
                }}
              />
            </div>
          </div>
        );
      }

      case "selectionType": {
        if (!("selectionType" in formElement.properties)) return;

        return (
          <div className="w-fullmb-2 mt-1">
            <div className="w-full">
              <Label className="mb-1 mx-1">
                {getHumanReadablePropertyName(propertyName)}
              </Label>
            </div>

            <ToggleGroup
              className="w-full"
              variant="outline"
              type="single"
              value={formElement.properties.selectionType}
              onValueChange={(value) => {
                console.log({ value });
                updatePageElementProperties(formElement.id, {
                  selectionType: value as SelectionProperties["selectionType"],
                });
              }}>
              <ToggleGroupItem value="single" aria-label="Toggle Single">
                Single
              </ToggleGroupItem>
              <ToggleGroupItem value="multiple" aria-label="Toggle Multiple">
                Multiple
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        );
      }

      case "optionPrefix": {
        if (!("optionPrefix" in formElement.properties)) return;

        return (
          <div className="w-full mb-2 mt-1">
            <div className="w-full">
              <Label className="mb-1 mx-1">
                {getHumanReadablePropertyName(propertyName)}
              </Label>
              <Select
                value={formElement.properties.optionPrefix}
                onValueChange={(value) => {
                  console.log({ value });
                  updatePageElementProperties(formElement.id, {
                    optionPrefix: value as SelectionProperties["optionPrefix"],
                  });
                }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select a prefix</SelectLabel>
                    {SelectionTypeOptions.map((option) => (
                      <SelectItem value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      }

      // case "choiceLabels": {
      //   if (!("choiceLabels" in formElement.properties)) return;

      //   return (
      //     <div className="w-full mb-2 mt-1">
      //       <div className="w-full">
      //         <Label className="mb-1 mx-1">
      //           {getHumanReadablePropertyName(propertyName)}
      //         </Label>
      //         show labels here...
      //       </div>
      //     </div>
      //   );
      // }

      case "order":
        // do not let user change order via toolkit
        break;

      // case "choiceLabels": {
      //  // give number of options a user can select if its multi select
      //   if (!("choiceLabels" in formElement.properties)) return;
      //   return (
      //     <div className="mb-2 mt-1">
      //       <div className="w-full">
      //         <Label className="mb-1 mx-1">
      //           {getHumanReadablePropertyName(propertyName)}
      //         </Label>
      //       </div>
      //       <div>

      //       </div>
      //     </div>
      //   );
      // }
      // default:
      //   return propertyName;
    }
  };

  const getCtaProperty = (propertyName: keyof PageCTA) => {
    const ctaObj = validActiveFormElement as PageCTA;
    switch (propertyName) {
      case "label":
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">Label</Label>
            <Input
              key={propertyName}
              type="text"
              value={ctaObj[propertyName]}
              placeholder={propertyName}
              onChange={(e) => {
                const value = e.target.value;
                console.log({ value });
                updatePageAction({
                  [propertyName]: value,
                });
              }}
            />
          </div>
        );
      case "hasArrow": {
        return (
          <div>
            <Label className="mb-1 mx-1">Has Arrow</Label>
            <Switch
              checked={ctaObj[propertyName]}
              onCheckedChange={(value) => {
                updatePageAction({
                  [propertyName]: value,
                });
              }}
            />
          </div>
        );
      }
      case "background": {
        return (
          <div>
            <Label className="mb-1 mx-1">Background</Label>
            <Select
              value={ctaObj[propertyName].type}
              onValueChange={(value) => {
                updatePageAction({
                  background: {
                    type: value as PageCTA["background"]["type"],
                    value: ctaObj.background.value,
                  },
                });
              }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Background Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Background Type</SelectLabel>
                  {PageCtaBackgroundOptions.map((option) => (
                    <SelectItem
                      value={option.value}
                      disabled={option.value !== "color"}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="my-2">
              <SwitchComponents
                when={ctaObj.background.type}
                cases={{
                  color: (
                    <Input
                      key={propertyName}
                      type="text"
                      value={ctaObj[propertyName].value}
                      placeholder={"Eg: #000000"}
                      onChange={(e) => {
                        const value = e.target.value;
                        console.log({ value });
                        updatePageAction({
                          background: {
                            type: ctaObj.background.type,
                            value,
                          },
                        });
                      }}
                    />
                  ),
                  gradient: <div>select gradient</div>,
                  image: <div>select image</div>, // give option to select from uploaded assets
                }}
              />
            </div>
          </div>
        );
      }
      case "textColor": {
        return (
          <div>
            <Label className="mb-1 mx-1">Text Color</Label>
            <Input
              key={propertyName}
              type="text"
              value={ctaObj[propertyName].value}
              placeholder={"Eg: #000000"}
              onChange={(e) => {
                const value = e.target.value;
                console.log({ value });
                updatePageAction({
                  textColor: {
                    type: ctaObj.textColor.type,
                    value,
                  },
                });
              }}
            />
          </div>
        );
      }
      case "borderRadius": {
        return (
          <div>
            <Label className="mb-1 mx-1">Border Radius</Label>
            <Select
              value={ctaObj.borderRadius}
              onValueChange={(value) => {
                console.log({ value });
                updatePageAction({
                  borderRadius: value as PageCTA["borderRadius"],
                });
              }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Border Radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Border Radius</SelectLabel>
                  {PageCtaBorderRadiusOptions.map((option) => (
                    <SelectItem value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      }

      case "alignment": {
        return (
          <div className="w-full">
            <Label className="mb-1 mx-1">Alignment</Label>
            <Select
              value={ctaObj.alignment}
              onValueChange={(value) => {
                console.log({ value });
                updatePageAction({
                  alignment: value as PageCTA["alignment"],
                });
              }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Alignment</SelectLabel>
                  {PageCtaAlignmentOptions.map((option) => (
                    <SelectItem value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      }

      default:
        break;
    }
  };

  const renderCTAProperties = () => {
    const ctaProperties = validActiveFormElement as PageCTA;
    const propertyEntries = Object.entries(ctaProperties).filter(
      ([propertyName]) =>
        !CTA_INACCESIBLE_PROPERTIES.has(propertyName as keyof PageCTA)
    );
    return (
      <div className="w-full h-full flex flex-col gap-3">
        {propertyEntries.map((property) => {
          const propertyName = property[0] as FieldPropertyName;

          return (
            <div key={propertyName} className="w-full">
              {getCtaProperty(propertyName as keyof PageCTA)}
            </div>
          );
        })}
      </div>
    );
  };

  const renderFormElementProperties = () => {
    const properties = (validActiveFormElement as FormElement).properties;

    const propertyEntries = Object.entries(properties).filter(
      ([propertyName]) =>
        !FORM_ELEMENT_INACCESIBLE_PROPERTIES.has(
          propertyName as keyof PrimitiveFieldProperties<PrimitiveFields>
        )
    );

    return (
      <div className="w-full h-full flex flex-col gap-3">
        {propertyEntries.map((property) => {
          const propertyName = property[0] as FieldPropertyName;
          // const value = property[1] as FieldPropertyValueType;

          return (
            <div key={propertyName} className="w-full">
              {getFormElementProperty(propertyName)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full px-2 py-2 border border-t-0 rounded">
      {/* container */}
      <div className="w-full flex flex-col justify-start gap-2 ">
        <div className="w-full text-lg font-semibold">
          {getHumanReadableElementType(
            (validActiveFormElement as PageCTA | FormElement).type
          )}
        </div>
        <div className="w-full flex flex-col justify-start gap-4">
          {validActiveFormElement.type === "cta"
            ? renderCTAProperties()
            : renderFormElementProperties()}
        </div>
      </div>
    </div>
  );
}

export default memo(Toolkit);

function EmptyPage() {
  return (
    <div className="w-full h-full flex justify-center place-items-center italic px-2 py-2 border border-t-0 rounded">
      select any form element
    </div>
  );
}
