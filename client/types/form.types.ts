import { MultiPageForm } from "@/store/form-builder.store";
import { Page } from "./form-builder.types";

export type FormConfiguration = {
  title: string;
  settings: MultiPageForm["pageSettings"];
  pages: Page[];
};
