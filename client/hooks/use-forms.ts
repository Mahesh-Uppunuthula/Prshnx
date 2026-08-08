import { formsApi } from "@/api/forms";
import { NEW_FORM_ID, QUERY_KEYS } from "@/lib/constants";
import type { SelectForm } from "@server/db/schemas/forms.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useForms = () => {
  return useQuery({
    queryKey: QUERY_KEYS.forms.getAllForms,
    queryFn: formsApi.getAllForms,
  });
};

export const useSaveForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: QUERY_KEYS.forms.saveForm,
    mutationFn: formsApi.createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.forms.getAllForms });
    },
    // onError: (error) => {
    //   console.error(error);
    // },
  });
};

export const useUpdateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: QUERY_KEYS.forms.updateForm,
    mutationFn: formsApi.updateForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.forms.getAllForms });
    },
  });
};

export const useDeleteForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: QUERY_KEYS.forms.deleteForm,
    mutationFn: formsApi.deleteForm,
    onSuccess: (data) => {
      const deletedFormId = data.deletionId;
      queryClient.setQueryData(
        QUERY_KEYS.forms.getAllForms,
        (oldData: SelectForm[]) => {
          console.log({ oldData });
          return oldData.filter((form) => form.id !== deletedFormId);
        },
      );
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

export const useFormConfigurationById = (
  formId: string,
  { enabled = true } = {},
) => {
  return useQuery({
    queryKey: QUERY_KEYS.forms.getFormConfigurationById(formId),
    queryFn: () => formsApi.getFormConfigurationById(formId),
    enabled: enabled,
    retry: 2,
  });
};
