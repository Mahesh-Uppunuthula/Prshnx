import { createFileRoute } from "@tanstack/react-router";
import { getFormConfigByPublicLinkQueryOptions } from "@/hooks/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import FormInstance from "@/components/FormInstance";

export const Route = createFileRoute("/embed/$formId")({
    loader: async ({ params, context }) => {
        const { formId } = params;
        try {
            const res = await context.queryClient.fetchQuery(getFormConfigByPublicLinkQueryOptions(formId));
            console.log("Asdf", res);
            return res;
        } catch (error) {
            console.error("Loader error:", error);
            throw error; // Re-throw to trigger errorComponent
        }
    },
    component: EmbedPage,
    pendingComponent: EmbedingSkeleton,
    errorComponent: ErrorPage,
});

function EmbedPage() {
    const { formId } = Route.useParams();
    const { data } = useSuspenseQuery(getFormConfigByPublicLinkQueryOptions(formId));

    useEffect(() => {
        // const height = document.body.scrollHeight;
        const height = document.body.scrollHeight;
        window.parent.postMessage(
            { type: "BHVR_FORM_HEIGHT", height: height },
            "*"
        );
    }, [data]);

    return (
        <div className="w-full h-full bg-white" >
            <FormInstance configuration={{
                title: data.title,
                settings: data.configuration.settings,
                pages: data.configuration.pages
            }} devMode={false} />
        </div>
    );
}

function EmbedingSkeleton() {
    return (
        <div className="bg-transparent p-4">
            loading... embeding-skeleton
        </div>
    );
}
function ErrorPage({ error }: { error: Error }) {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <div className="text-center p-8 max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Form Not Found
                </h1>
                <p className="text-gray-600 mb-4">
                    {error.message || "The form you're looking for doesn't exist or has been removed."}
                </p>
                <p className="text-sm text-gray-500">
                    Please check the form URL and try again.
                </p>
            </div>
        </div>
    );
}
