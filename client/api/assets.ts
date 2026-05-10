import type { AppType } from "@server/app";
import { hc } from "hono/client";

const client = hc<AppType>("/");
export const assetsApi = {
  listUserAssetFolders: async () => {
    const listUserAssetFolders =
      await client.api.protected.v1.assets.folders.$get();
    if (!listUserAssetFolders.ok) throw new Error("Failed to fetch folders");
    return await listUserAssetFolders.json();
  },
  listFolderAssets: async (folder: string) => {
    const listFolderAssets = await client.api.protected.v1.assets.folders[
      ":folder"
    ].$get({
      param: { folder },
    });
    if (!listFolderAssets.ok) throw new Error("Failed to fetch folder assets");
    return await listFolderAssets.json();
  },
  uploadAsset: async (file: File, folder: string) => {
    const response = await client.api.protected.v1.assets.upload.$post({
      form: {
        file,
        folder,
      },
    });
    if (!response.ok) throw new Error("Failed to upload asset");
    const data = await response.json();
    return data as { url: string; key: string; name: string };
  },
};
