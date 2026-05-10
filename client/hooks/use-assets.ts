import { useMutation, useQuery } from "@tanstack/react-query";
import { assetsApi } from "@/api/assets";
import { QUERY_KEYS } from "@/lib/constants";

export const useUserAssetFolders = () => {
  return useQuery({
    queryKey: QUERY_KEYS.assets.getUserAssetFolders,
    queryFn: () => assetsApi.listUserAssetFolders(),
  });
};

export const useFolderAssets = (folder: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.assets.getUserAssets(folder),
    queryFn: () => assetsApi.listFolderAssets(folder),
    enabled: !!folder,
  });
};

export const useUploadAsset = () => {
  return useMutation({
    mutationKey: QUERY_KEYS.assets.uploadAsset,
    mutationFn: (variables: { file: File; folder: string }) =>
      assetsApi.uploadAsset(variables.file, variables.folder),
  });
};
