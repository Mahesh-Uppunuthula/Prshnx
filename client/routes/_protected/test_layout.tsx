import Node from "@/components/layout-builder/Node";
import ActionBar from "@/components/layout-builder/action-bar";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Structure } from "../../store/layout-builder.store";
export const Route = createFileRoute("/_protected/test_layout")({
  component: TestLayout,
});

const data: Structure = {
  id: "root",
  type: "column",
  children: [
    {
      id: "col1",
      type: "column",
      children: [
        {
          id: "field1",
          type: "field",
        },
        {
          id: "field2",
          type: "field",
        },
      ],
    },
    {
      id: "col2",
      type: "column",
    },
  ],
};

type Action = {
  type: "split_horizontal" | "split_vertical";
  payload: {parentId: string}
}  | {
  type: "delete";
  payload: { id: string };
};

export type ActionBarDispatcher = (action: Action) => void; 

function TestLayout() {
  
  function dispatchActionBarActions(action: Action){
    switch(action.type){
      case "split_horizontal": 
        console.log("split horizontally", action.payload);
      break;
      case "split_vertical":
        console.log("split vertically", action.payload);
      break;
      case "delete":
        console.log("delete", action.payload);
      break;
    }
  }

  return (
    <div className="">
      {data.id} - {data.type}
      <div
        className={cn("p-4 border rounded", {
          "flex gap-2": data.type === "row",
          "flex-col gap-2": data.type === "column",
        })}
      >
        {data.children?.map((child) => (
          <Node key={child.id} {...child} />
        ))}
      </div>
      <ActionBar dispatch={dispatchActionBarActions} />
    </div>
  );
}
