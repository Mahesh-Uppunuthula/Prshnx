import { embedApi } from "@/api/embed";
import { QUERY_KEYS } from "@/lib/constants";

export const getFormConfigByIdQueryOptions = (publicFormId: string) => {
  return {
    queryKey: QUERY_KEYS.embed.getFormConfigById(publicFormId),
    queryFn: () => embedApi.getFormConfigById(publicFormId),
  };
};
