"use client";

import { paletteElements } from "@/lib/constants";
import { DraggablePaletteItem } from "./DraggablePaletteItem";
import { Input } from "../ui/input";
import { useState } from "react";
import { LuPanelRightOpen } from "react-icons/lu";
import { Button } from "../ui/button";
import Show from "../utils/Show";
import { cn } from "@/lib/utils";

type ElementsPanelProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function ElementsPanel({
  isOpen,
  setIsOpen,
}: ElementsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredElements = paletteElements.filter((paletteElement) =>
    paletteElement.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <section className="w-full h-full overflow-hidden flex flex-col">
      <Show
        when={isOpen}
        fallback={
          <div
            className="h-full w-full flex flex-col justify-center items-center cursor-pointer transition-colors"
            onClick={() => setIsOpen(true)}>
            <span className="text-xs font-medium tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 text-muted-foreground whitespace-nowrap">
              elements
            </span>
          </div>
        }>
        <>
          <div
            className={cn("my-2 mx-auto flex gap-2 justify-between", {
              "w-[98%]": isOpen,
            })}>
            <Input
              type="text"
              className="shadow-none!"
              placeholder="Search elements "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              className="rounded"
              variant={"ghost"}
              size={"icon"}
              onClick={() => setIsOpen(false)}>
              <LuPanelRightOpen />
            </Button>
          </div>
          <div className="w-full h-fit flex flex-col gap-2">
            {filteredElements.map((paletteElement) => (
              <DraggablePaletteItem
                key={paletteElement.id}
                paletteElement={paletteElement}
              />
            ))}
          </div>
        </>
      </Show>
    </section>
  );
}
