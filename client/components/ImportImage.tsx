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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ImageUpload } from "./ImageUpload";
import EmbedImageUrl from "./EmbedImageUrl";

type ImportImageProps = {
  trigger: ReactNode;
  onImport?: (image: string) => void;
};

function ImportImage({ trigger, onImport }: ImportImageProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  function handleUploadImage() {
    onImport?.(selectedImage!);
    setSelectedImage(null);
    setActiveTab("gallery");
  }

  return (
    <Dialog modal={true}>
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
            setSelectedImage(null);
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
                value="link"
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
              <ImageUpload onImageSelect={setSelectedImage} />
            </TabsContent>
            <TabsContent value="gallery" className="mt-0 h-full">
              Gallery Content
            </TabsContent>
            <TabsContent value="link" className="mt-0 h-full">
              <EmbedImageUrl onImageSelect={setSelectedImage} />
            </TabsContent>
            <TabsContent
              value="unsplash"
              className="mt-0 h-full flex justify-center items-center">
              coming soon!
            </TabsContent>
          </div>
        </Tabs>
        <DialogFooter className="px-6 py-4 border-t bg-muted/30 mt-auto mx-0 mb-0 rounded-none sm:justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-lg px-6">
              Cancel
            </Button>
          </DialogClose>
          {activeTab === "upload" ? (
            <Button
              className="rounded-lg px-6 bg-black hover:bg-black/90"
              disabled={!selectedImage}
              onClick={handleUploadImage}>
              Upload
            </Button>
          ) : (
            <Button
              className="rounded-lg px-6 bg-black hover:bg-black/90"
              disabled={!selectedImage}
              onClick={() => selectedImage && onImport?.(selectedImage)}>
              Import
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportImage;
