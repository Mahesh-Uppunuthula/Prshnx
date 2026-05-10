import { Hono } from "hono";
import { asyncHandler } from "../../lib/utils";
import { uploadAsset } from "../../controllers/asset.controller";
import assetFoldersRoute from "./folders";

const assetsRoute = new Hono()
  .route("/folders", assetFoldersRoute)
  .post("/upload", asyncHandler(uploadAsset));

export default assetsRoute;
