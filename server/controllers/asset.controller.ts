import type { Context } from "hono";
import { R2Service } from "../services/r2.service";
import { ErrorResponse } from "../types/error";
import { REQUEST_VARIABLES } from "../lib/constants";
import type { UserType } from "@kinde-oss/kinde-typescript-sdk";

const r2Service = new R2Service();

export const uploadAsset = async (c: Context) => {
  const userDetails = c.get(REQUEST_VARIABLES.USER_DETAILS) as UserType;
  const ownerId = userDetails.id;

  const body = await c.req.parseBody({ all: true });

  const file = body["file"] as File | undefined;
  const folder = (body["folder"] as string) || "general";
  console.log("upload asset body parsed:", {
    hasFile: !!file,
    fileName: file?.name,
    folder,
  });

  if (!file) {
    throw new ErrorResponse("No file uploaded", 400);
  }

  // Generate a unique key for the asset
  // Pattern: assets/{ownerId}/{folder}/{timestamp}-{filename}
  const timestamp = Date.now();
  const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${ownerId}/assets/${folder}/${timestamp}-${fileName}`;

  const result = await r2Service.upload(file, key);

  return c.json({
    url: result,
    key: key,
    name: file.name,
    size: file.size,
    type: file.type,
  });
};

export const getUserFolders = async (c: Context) => {
  const userDetails = c.get(REQUEST_VARIABLES.USER_DETAILS) as UserType;
  const ownerId = userDetails.id;

  // List only the top-level "folders" under assets/
  const rootPrefix = `${ownerId}/assets/`;
  const folders = await r2Service.listTopLevelFolders(rootPrefix, "/");

  console.log("FOLDERS", folders);

  return c.json(folders);
};

export const getFolderAssets = async (c: Context) => {
  const folderParam = c.req.param("folder");

  if (!folderParam) {
    throw new ErrorResponse("Folder name is required", 400);
  }

  const userDetails = c.get(REQUEST_VARIABLES.USER_DETAILS) as UserType;
  const ownerId = userDetails.id;

  // List assets in this folder
  const prefix = `${ownerId}/assets/${folderParam}/`;
  const assets = await r2Service.listAssets(prefix);
  return c.json(assets);
};
