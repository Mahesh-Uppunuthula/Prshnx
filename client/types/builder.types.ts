// Utils
export type Orientation = "horizontal" | "vertical";

export type BaseFieldProperties = {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  disabled: boolean;
};

export type SingleLineInputProperties = BaseFieldProperties & {
  type: "single-line-input";
  placeholder?: string;
  minLength: number;
  maxLength: number;
};
export type SingleLineHiddenInputProperties = BaseFieldProperties & {
  type: "single-line-hidden-input";
  placeholder?: string;
  minLength: number;
  maxLength: number;
};
export type MultiLineInputProperties = BaseFieldProperties & {
  type: "multi-line-input";
  placeholder?: string;
  minLength: number;
  maxLength: number;
};
export type NumberInputProperties = BaseFieldProperties & {
  type: "number-input";
  placeholder?: string;
  min: number;
  max: number;
};

export type ChatBlockBaseFieldProperties = Pick<
  BaseFieldProperties,
  "id" | "required" | "disabled"
>;
export type ChatBlockProperties = ChatBlockBaseFieldProperties & {
  type: "chat-block";
  questioner: {
    name: string;
    avatar: string;
  };
  respondent: {
    name: string;
    avatar: string;
  };
  question: string;
  response: ConventionalFields;
};

export type ChatBlockNode = ChatBlockProperties;
// non interactable fields
export type ContainerProperties = {
  type: "container";
  id: string;
  label: string;
  isScrollable?: boolean;
};

export type Fields =
  | SingleLineInputProperties
  | SingleLineHiddenInputProperties
  | MultiLineInputProperties
  | NumberInputProperties
  | ChatBlockProperties
  | ContainerProperties;

export type FieldTypes = Fields["type"];
export type ConventionalFields = Exclude<
  Fields,
  ChatBlockProperties | ContainerProperties
>;
export type InputFields = Exclude<Fields, ContainerProperties>;
export type InputFieldTypes = InputFields["type"];

export type ContainerNode = {
  id: string;
  label: string;
  type: "container";
  orientation: Orientation;
  children: string[];
  isScrollable?: boolean;
};

export type FieldNode = Fields;
export type Node = ContainerNode | FieldNode;

export type Layout = {
  parentId: Node["id"] | null;
  children: Node["id"][];
};

export type Page = {
  id: string;
  label: string;
  rootId: Node["id"];
  layout: Record<Node["id"], Layout>;
  nodes: Record<Node["id"], Node>;
  containerCount: number;
  fieldCount: number;
};

export type PageLayout = Pick<Page, "layout" | "nodes">;
