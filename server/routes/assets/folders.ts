import { Hono } from "hono";
import { asyncHandler } from "../../lib/utils";
import { getFolderAssets, getUserFolders } from "../../controllers/asset.controller";

const assetFoldersRoute = new Hono()
  .get("/", asyncHandler(getUserFolders))
  .get("/:folder", asyncHandler(getFolderAssets));

export default assetFoldersRoute;