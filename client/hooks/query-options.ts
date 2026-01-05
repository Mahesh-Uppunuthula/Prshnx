import { embedApi } from "@/api/embed";
import { QUERY_KEYS } from "@/lib/constants";

export const getFormConfigByPublicLinkQueryOptions = (publicLink: string) => {
  return {
    queryKey: QUERY_KEYS.embed.getFormConfigurationByPublicLink(publicLink),
    queryFn: () => embedApi.getFormConfigurationByPublicLink(publicLink),
  };
};
