import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/f/$formId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { formId } = Route.useParams()
  return (
    <div>
      Form ID: {formId}
    </div>
  )
}
