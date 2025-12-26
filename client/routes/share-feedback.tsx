import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/share-feedback')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/share-feedback"!</div>
}
