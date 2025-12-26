import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/help-center')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/help-center"!</div>
}
