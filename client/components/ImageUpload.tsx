import { useState, useCallback, useMemo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LuTrash2, LuUpload } from "react-icons/lu";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  onImageSelect?: (image: string | null) => void;
};

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingFileType, setDraggingFileType] = useState<string | undefined>(
    undefined,
  );

  const handleFile = useCallback(
    (file?: File) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setPreview(result);
          onImageSelect?.(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    e.dataTransfer.dropEffect = "copy";

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      console.log(e.dataTransfer.items[0]?.type);
      setDraggingFileType(e.dataTransfer.items[0]?.type);
    }
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removePreview = () => {
    setPreview(null);
    onImageSelect?.(null);
  };

  const invalidFileType = useMemo(() => {
    return (
      isDragging && !!draggingFileType && !draggingFileType.startsWith("image/")
    );
  }, [isDragging, draggingFileType]);

  return (
    <div className="flex h-full">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "w-full min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground gap-3 transition-colors",
          {
            "border-indigo-500 bg-indigo-50/50": isDragging,
            "border-muted-foreground/20 hover:border-muted-foreground/40":
              !isDragging,
            "border-red-500 bg-red-50/50": invalidFileType,
            "border-r-0 rounded-r-none": preview,
          },
        )}>
        {!invalidFileType ? (
          <>
            <div className="p-3 bg-muted rounded-full">
              <LuUpload className="size-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground text-lg">
                Drop files to upload
              </p>
              <p className="text-sm">
                or
                <label
                  htmlFor="import-image-file-upload"
                  className="cursor-pointer text-indigo-500 mx-1 font-semibold hover:underline">
                  browse
                </label>
                <Input
                  id="import-image-file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
                to choose a file
              </p>
            </div>
            <p className="text-xs text-muted-foreground/60">
              Supports: PNG, JPG, JPEG, SVG (max 5MB)
            </p>
          </>
        ) : (
          <p className="text-sm text-red-500 font-medium">
            Only image files are allowed
            <p className="text-xs text-muted-foreground/60">
              Supports: PNG, JPG, JPEG, SVG (max 5MB)
            </p>
          </p>
        )}
      </div>

      {preview && (
        <div className="w-full h-full space-y-3 border-2 border-dashed p-3 rounded-r-lg flex flex-col">
          {/* <p className="text-s font-medium">Preview</p> */}
          <div className="relative w-full group flex-1 flex flex-col gap-2 place-items-center">
            <img
              src={preview}
              alt="Preview"
              className="max-w-[75%] aspect-square rounded-lg border shadow-sm object-center bg-muted"
            />
            <Button
              className="w-[90%] mt-auto"
              size="sm"
              variant="destructive"
              onClick={removePreview}>
              <LuTrash2 /> Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
