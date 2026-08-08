import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/chat/")({
  component: ChatLayout,
});

function ChatLayout() {
  return <div className="w-full h-full">chat layout</div>;
}
