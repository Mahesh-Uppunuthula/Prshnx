import { useQuery } from "@tanstack/react-query";
import { assetsApi } from "@/api/assets";

export const useUserAssetFolders = () => {
  return useQuery({
    queryKey: ["user-asset-folders"],
    queryFn: () => assetsApi.listUserAssetFolders(),
  });
};

export const useFolderAssets = (folder: string) => {
  return useQuery({
    queryKey: ["folder-assets", folder],
    queryFn: () => assetsApi.listFolderAssets(folder),
    enabled: !!folder,
  });
};
