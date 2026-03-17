import { paletteElements } from "@/lib/constants";
import { DraggablePaletteItem } from "./DraggablePaletteItem";

export default function ElementsPanel() {
  return (
    <section className="w-full h-full overflow-auto">
      <div className="w-full h-fit flex flex-col gap-2">
        {paletteElements.map((paletteElement) => (
          <DraggablePaletteItem
            key={paletteElement.id}
            paletteElement={paletteElement}
          />
        ))}
      </div>
    </section>
  );
}
