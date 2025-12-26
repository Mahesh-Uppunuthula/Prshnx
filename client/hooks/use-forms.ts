import { formsApi } from "@/api/forms";
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
