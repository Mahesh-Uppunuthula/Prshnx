import { publicFormApi } from '@/api/public-form'
import { FormNotFound } from '@/components/FormNotFound'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/f/$formId/')({
  beforeLoad: async ({ params, context }) => {
    const { formId } = params;
    console.log({ formId })
    const data = await context.queryClient.fetchQuery({
      queryKey: ["getPublicForm"],
      queryFn: () => publicFormApi.getPublicForm(formId),
      staleTime: Infinity,
    })
    console.log({ data })
    return { data }
  },
  component: RouteComponent,
  errorComponent: ErrorComponent,
})

function RouteComponent() {
  const { formId } = Route.useParams()
  const { data } = Route.useRouteContext()

  if (!data?.isPublishedValidLink) {
    return <FormNotFound />
  }

  return (
    <div>
      {/* render the actual form   */}
      Form ID: {formId}
    </div>
  )
}

function ErrorComponent() {
  return <FormNotFound />
}
