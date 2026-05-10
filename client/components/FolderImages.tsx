import { useFolderAssets } from "@/hooks/use-assets";
import { Spinner } from "./ui/spinner";
import { LuImage, LuCheck } from "react-icons/lu";
import { GalleryImageState } from "./ImportImage";
import { useEffect, useMemo, useState } from "react";

interface FolderImagesProps {
  folderName: string;
  onChange?: (state: GalleryImageState) => void;
}

function FolderImages({ folderName, onChange }: FolderImagesProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: assets, isLoading } = useFolderAssets(folderName);

  const state = useMemo<GalleryImageState>(
    () => ({
      type: "gallery",
      valid: selectedImage !== null,
      payload: { imageUrl: selectedImage ?? "" },
    }),
    [selectedImage],
  );

  useEffect(() => {
    onChange?.(state);
  }, [onChange, state]);

  function handleOnClick(asset: Exclude<typeof assets, undefined>[number]) {
    setSelectedImage((prev) => {
      if (prev === asset.url) {
        return null;
      }
      return asset.url ?? prev;
    });
  }
  
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-muted-foreground py-10 gap-2">
        <LuImage className="size-10 opacity-20" />
        <p>No images found in this folder</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
      {assets.map((asset) => {
        const isSelected = selectedImage === asset.url;
        return (
          <div
            key={asset.key}
            onClick={() => handleOnClick(asset)}
            className={`group relative aspect-square rounded-xl border overflow-hidden transition-all cursor-pointer shadow-sm hover:shadow-md ${
              isSelected
                ? "border-indigo-500 ring-2 ring-indigo-500/20"
                : "bg-muted/20 hover:border-muted-foreground/30"
            }`}>
            <img
              src={asset.url}
              alt={asset.key}
              className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                isSelected ? "opacity-90" : ""
              }`}
            />

            {/* Selection Indicator */}
            <div
              className={`absolute top-2 right-2 transition-all duration-200 ${
                isSelected
                  ? "opacity-100 scale-100"
                  : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              }`}>
              {isSelected ? (
                <div className="bg-indigo-600 text-white p-1 rounded-full shadow-md border border-white/20">
                  <LuCheck className="size-4" />
                </div>
              ) : (
                <div className="bg-black/20 backdrop-blur-sm border-2 border-white/80 p-1 rounded-full size-6 flex items-center justify-center">
                  <div className="size-full rounded-full border border-white/20" />
                </div>
              )}
            </div>

            {/* Selected Overlay */}
            {isSelected && (
              <div className="absolute inset-0 bg-indigo-500/5 transition-opacity" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FolderImages;
