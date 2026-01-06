import { formsApi } from "@/api/forms";
import { NEW_FORM_ID, QUERY_KEYS } from "@/lib/constants";
import type { SelectForm } from "@server/db/forms.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useForms = () => {
  return useQuery({
    queryKey: ["forms"],
    queryFn: formsApi.getAllForms,
  });
};

export const useSaveForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["save-form"],
    mutationFn: formsApi.createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
    // onError: (error) => {
    //   console.error(error);
    // },
  });
};

export const useDeleteForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-form"],
    mutationFn: formsApi.deleteForm,
    onSuccess: (data) => {
      const deletedFormId = data.deletionId;
      queryClient.setQueryData(["forms"], (oldData: SelectForm[]) => {
        console.log({ oldData });
        return oldData.filter((form) => form.id !== deletedFormId);
      });
    },
  });
};

export const useFormEmbed = (formId: string) => {
  return useQuery({
    queryKey: ["form-embed", formId],
    queryFn: () => formsApi.getFormEmbed(formId),
    enabled: !!formId,
  });
};

export const useFormConfigurationById = (formId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.forms.getFormConfigurationById(formId),
    queryFn: () => formsApi.getFormConfigurationById(formId),
    enabled: !!formId || formId !== NEW_FORM_ID,
  });
};
