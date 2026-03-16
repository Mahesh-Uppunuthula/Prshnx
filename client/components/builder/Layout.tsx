import ElementsPanel from "./ElementsPanel";
import PagesMinMap from "./PageMinMap";
import Playground from "./Playground";

export default function BuilderBodyLayout() {
  return (
    <div className="w-full h-[92%] flex">
      <div className="w-[18%]">
        <ElementsPanel />
      </div>
      <div className="w-[82%] relative  flex justify-between">
        <div className="w-[95%]">
          <Playground />
        </div>

        {/* Pages Min Map */}
        <div className="w-[5%] flex justify-center place-items-start">
          <div className="translate-y-20">
            <PagesMinMap />
          </div>
        </div>
      </div>
    </div>
  );
}
