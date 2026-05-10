import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";

import { ReactNode, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import ImageUpload from "./ImageUpload";
import EmbedImageUrl from "./EmbedImageUrl";
import Gallery from "./Gallery";
import { useUploadAsset } from "@/hooks/use-assets";
import { QUERY_KEYS } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { LucideAlertCircle } from "lucide-react";

export type UploadImageState = {
  type: "upload";
  valid: boolean;
  payload: {
    file: File | null;
    folder: string;
  };
};

export type GalleryImageState = {
  type: "gallery";
  valid: boolean;
  payload: {
    imageUrl: string;
  };
};

export type EmbedImageUrlState = {
  type: "embed";
  valid: boolean;
  payload: {
    url: string;
  };
};

export type ImportImageState =
  | UploadImageState
  | GalleryImageState
  | EmbedImageUrlState;

type ImportImageProps = {
  trigger: ReactNode;
  onImport?: (image: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
};

function ImportImage({
  trigger,
  onImport,
  open,
  onOpenChange,
  onClose,
}: ImportImageProps) {
  const queryClient = useQueryClient();
  // hooks
  const {
    mutate: uploadAsset,
    isPending: isAssetLoading,
    error: assetError,
  } = useUploadAsset();

  const [activeTab, setActiveTab] = useState("upload");
  const [importImage, setImportImage] = useState<ImportImageState | null>(null);

  const getCTAButtonText = () => {
    if (isAssetLoading) return "Uploading...";
    switch (activeTab) {
      case "upload":
        return "Upload";
      default:
        return "Import";
    }
  };

  const onImageUpload = (file: File, folder: string) => {
    uploadAsset(
      {
        file,
        folder,
      },
      {
        onSuccess: (data) => {
          onImport?.(data?.url);
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.assets.getUserAssets(folder),
          });
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.assets.getUserAssetFolders,
          });
        },
      },
    );
  };

  const handleMainAction = () => {
    if (!importImage?.valid || isAssetLoading) return;

    switch (activeTab) {
      case "upload":
        {
          if (importImage?.type === "upload" && importImage?.payload.file) {
            onImageUpload(
              importImage.payload.file,
              importImage.payload.folder ?? "general",
            );
          }
        }
        break;
      case "gallery":
        {
          console.log("gallery case", importImage);
          if (
            importImage?.type === "gallery" &&
            importImage?.payload.imageUrl
          ) {
            onImport?.(importImage.payload.imageUrl);
          }
        }
        break;

      case "link":
        {
          if (importImage?.type === "embed" && importImage?.payload.url) {
            onImport?.(importImage.payload.url);
          }
        }
        break;
      default:
        break;
    }
    onClose?.();
  };

  return (
    <Dialog modal={true} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-full min-w-[50vw] h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Import Images</DialogTitle>
          <DialogDescription>
            Choose where you want to import image from
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
          }}
          className="w-full flex-1 flex flex-col overflow-hidden">
          <div className="w-full px-6">
            <TabsList className="w-full bg-muted/50 p-1 h-auto rounded-xl gap-1">
              <TabsTrigger
                value="upload"
                className="rounded-lg data-[state=active]:text-indigo-600 data-[state=active]:bg-white px-6 py-2 shadow-none data-[state=active]:shadow-sm">
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="rounded-lg data-[state=active]:text-indigo-600 data-[state=active]:bg-white px-6 py-2 shadow-none data-[state=active]:shadow-sm">
                Gallery
              </TabsTrigger>
              <TabsTrigger
                value="embed"
                className="rounded-lg data-[state=active]:text-indigo-600 data-[state=active]:bg-white px-6 py-2 shadow-none data-[state=active]:shadow-sm">
                Embed URL
              </TabsTrigger>
              <TabsTrigger
                value="unsplash"
                className="rounded-lg data-[state=active]:text-indigo-600 data-[state=active]:bg-white px-6 py-2 shadow-none data-[state=active]:shadow-sm">
                Unsplash
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-y-auto p-6 pt-0">
            <TabsContent value="upload" className="mt-0 h-full">
              <ImageUpload onChange={setImportImage} />
            </TabsContent>
            <TabsContent value="gallery" className="mt-0 h-full">
              <Gallery onChange={setImportImage} />
            </TabsContent>
            <TabsContent value="embed" className="mt-0 h-full">
              <EmbedImageUrl onChange={setImportImage} />
            </TabsContent>
            <TabsContent
              value="unsplash"
              className="mt-0 h-full flex justify-center items-center">
              coming soon!
            </TabsContent>
          </div>
        </Tabs>
        <DialogFooter className="px-6 py-4 border-t bg-muted/30 mt-auto mx-0 mb-0 rounded-none flex place-items-center">
          {assetError && (
            <div className="w-full">
              <Alert variant="destructive" className="rounded-lg py-2 h-fit">
                <LucideAlertCircle className="size-4" />
                <AlertTitle className="text-xs">Import Failed</AlertTitle>
                <AlertDescription className="text-xs opacity-90">
                  {assetError instanceof Error
                    ? assetError.message
                    : "Something went wrong while uploading/importing image"}
                </AlertDescription>
              </Alert>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-lg px-6">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="rounded-lg px-6 bg-black hover:bg-black/90"
              disabled={!importImage?.valid}
              onClick={handleMainAction}>
              {getCTAButtonText()}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportImage;
