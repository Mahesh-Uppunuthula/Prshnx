/********Styling*********/

/**
 * Color
 */

type Color = string;

/**
 * Font Styles
 */
type FontWeight = "normal" | "bold" | "light";

/**
 * Border Styles
 */
type Sides = "top" | "bottom" | "left" | "right";
type BorderSides = Sides | "all";
type BorderRadius = "small" | "medium" | "large";

type BorderStyle = {
  sides: BorderSides;
  radius: BorderRadius;
};

/**
 * Padding Styles
 */
type PaddingStyle = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

/**
 * Margin Styles
 */
type MarginStyle = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

/**
 * Text Styles
 */
type TextStyle = {
  color: Color;
  fontSize: number;
  fontWeight: FontWeight;
  fontFamily: string; // TODO have to be specific from a defined font family list
};

/**
 * Background Styles
 */
type BackgroundStyle = {
  type: "color" | "gradient" | "image";
  value: string; // converted to string
};

/**
 * Page Styles
 */

type PageActionAlignment = "left" | "center" | "right" | "full";
type PageActionType = "submit" | "next";

type PageActionStyles = {
  border: BorderStyle;
  padding: PaddingStyle;
  margin: MarginStyle;
  text: TextStyle;
  background: BackgroundStyle;
};

type PageAction = {
  type: "cta";
  label: string;
  actionType: PageActionType;
  styles: PageActionStyles;
  alignment: PageActionAlignment;
  hasArrow: boolean;
};

export type LayoutAlignment = "horizontal" | "vertical";

type Container = {
  id: string;
  type: "container";
  align?: LayoutAlignment;
  children: Layout[];
};

type Field = {
  id: string;
  type: "field";
  name: string;
};

type Layout = Container | Field;

// type ChatForm = {
//   type: "chat";
// };

// type ClassicForm = {
//   type: "classic";
// };

// type AllForms = ChatForm | ClassicForm;

// type FormType = AllForms["type"];

type FormType = "classic" | "chat";

type Form = {
  type: FormType;
};

type Page = {
  id: string;
  name: string;
  layout: Layout;
  action: PageAction;
  form: Form;
};

export type LayoutBuilder = {
  pages: Page[];
};

export type NodeType = "container" | "field";

export type ContainerNode = {
  id: string;
  type: "container";
  direction: "row" | "column";
  parentId: string | null;
  children: string[]; // container ids
};

export type FieldNode = {
  id: string;
  type: "field";
  fieldType: string;
  label: string;
  parentId: string; // container id
};

export type BuilderNode = ContainerNode | FieldNode;

export type BuilderState = {
  rootId: string;
  nodes: Record<string, BuilderNode>;
  //   containers: Record<string, ContainerNode>;
  //   fields: Record<string, FieldNode>;
};
