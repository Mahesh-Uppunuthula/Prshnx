import { embedApi } from "@/api/embed";
import { formsApi } from "@/api/forms";
import { QUERY_KEYS } from "@/lib/constants";

export const getFormConfigByPublicLinkQueryOptions = (publicLink: string) => {
  return {
    queryKey: QUERY_KEYS.embed.getFormConfigurationByPublicLink(publicLink),
    queryFn: () => embedApi.getFormConfigurationByPublicLink(publicLink),
  };
};

export const getFormConfigurationByIdQueryOptions = (formId: string) => {
  return {
    queryKey: QUERY_KEYS.forms.getFormConfigurationById(formId),
    queryFn: () => formsApi.getFormConfigurationById(formId),
  };
};
