import BuilderBodyLayout from "@/components/builder/Layout";
// import NavigationBar from "@/components/builder/NavigationBar";
import QuickActionBar from "@/components/builder/QuickActionsBar";

export default function Builder() {
  return <BuilderLayout />;
}

function BuilderLayout() {
  return (
    <div className="w-full h-full">
      {/* <NavigationBar /> */}
      <BuilderBodyLayout />
      <div className="fixed bottom-1 left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <QuickActionBar />
      </div>
    </div>
  );
}
