import { useState, useCallback, useMemo, useEffect } from "react";
import { useUserAssetFolders } from "@/hooks/use-assets";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LuTrash2, LuUpload } from "react-icons/lu";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UploadImageState } from "./ImportImage";

type ImageUploadProps = {
  onChange: (state: UploadImageState) => void;
};

export default function ImageUpload({ onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingFileType, setDraggingFileType] = useState<string | undefined>(
    undefined,
  );

  const [uploadMethod, setUploadMethod] = useState<"new" | "existing">("new");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [customFolderName, setCustomFolderName] = useState<string>("");
  const [isFolderSelectOpen, setIsFolderSelectOpen] = useState(false);

  const { data: folders, isLoading: isFetchingFolders } = useUserAssetFolders();

  const invalidFileType = useMemo(() => {
    return (
      isDragging && !!draggingFileType && !draggingFileType.startsWith("image/")
    );
  }, [isDragging, draggingFileType]);

  const isFolderValid = useMemo(() => {
    if (uploadMethod === "new") {
      return customFolderName.trim().length >= 3;
    } else {
      return selectedFolder.length >= 3;
    }
  }, [uploadMethod, customFolderName, selectedFolder]);

  const currentFolder = useMemo(() => {
    return uploadMethod === "new" ? customFolderName : selectedFolder;
  }, [uploadMethod, customFolderName, selectedFolder]);

  const state = useMemo<UploadImageState>(() => {
    return {
      type: "upload",
      valid: selectedFile !== null && isFolderValid,
      payload: {
        file: selectedFile,
        folder: currentFolder,
      },
    };
  }, [selectedFile, isFolderValid, currentFolder]);

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  const handleFile = useCallback((file?: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

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
    setSelectedFile(null);
  };

  const handleChangeMethod = (method: "new" | "existing") => () => {
    setUploadMethod(method);
    if (method === "new") {
      setSelectedFolder("");
    } else {
      setCustomFolderName("");
    }
  };

  const handleFolderSelectOpenChange = (open: boolean) => {
    setIsFolderSelectOpen(open);
    if (open) setUploadMethod("existing");
  };

  const handleFolderSelectValueChange = (value: string) => {
    setSelectedFolder(value);
    setIsFolderSelectOpen(false);
  };

  const handleCustomFolderNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newFolderName = e.target.value;
    setCustomFolderName(newFolderName);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 place-items-start">
      {/* Folder selection */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* New Upload Card */}
        <div
          onClick={handleChangeMethod("new")}
          className={cn(
            "relative p-2 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 bg-white",
            uploadMethod === "new"
              ? "border-indigo-500"
              : "border-border hover:border-muted-foreground/30",
          )}>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm px-1">
              Create new folder
            </span>
            <div
              className={cn(
                "size-5 rounded-full border-2 flex items-center justify-center transition-colors",
                uploadMethod === "new"
                  ? "bg-indigo-600 border-indigo-600"
                  : "border-muted-foreground/30",
              )}>
              {uploadMethod === "new" && (
                <div className="size-2 rounded-full bg-white" />
              )}
            </div>
          </div>
          <Input
            placeholder="Enter folder name"
            value={customFolderName}
            disabled={uploadMethod !== "new"}
            onChange={handleCustomFolderNameChange}
          />
        </div>

        {/* Existing Source Card */}
        <div
          onClick={handleChangeMethod("existing")}
          className={cn(
            "relative p-2 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 bg-white",
            uploadMethod === "existing"
              ? "border-indigo-500"
              : "border-border hover:border-muted-foreground/30",
          )}>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm px-1">
              Select existing folder
            </span>
            <div
              className={cn(
                "size-5 rounded-full border-2 flex items-center justify-center transition-colors",
                uploadMethod === "existing"
                  ? "bg-indigo-600 border-indigo-600"
                  : "border-muted-foreground/30",
              )}>
              {uploadMethod === "existing" && (
                <div className="size-2 rounded-full bg-white" />
              )}
            </div>
          </div>
          <Select
            open={isFolderSelectOpen}
            onOpenChange={handleFolderSelectOpenChange}
            value={selectedFolder}
            onValueChange={handleFolderSelectValueChange}
            disabled={
              uploadMethod !== "existing" ||
              isFetchingFolders ||
              !folders?.length
            }>
            <SelectTrigger className="w-full h-10 text-sm">
              <SelectValue
                placeholder={
                  isFetchingFolders
                    ? "Loading folders..."
                    : !folders || folders.length === 0
                      ? "No existing folders"
                      : "Select folder"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {folders?.map((item: any) => (
                <SelectItem key={item.key} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* DnD and Image preview */}
      <div className="flex w-full">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={cn(
            "w-full min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground gap-3 transition-colors",
            {
              "border-indigo-500 bg-indigo-50/50 border-r-2 rounded-r-none":
                isDragging,
              "border-muted-foreground/20 hover:border-muted-foreground/40":
                !isDragging,
              "border-red-500 bg-red-50/50": invalidFileType,
              "border-r-0 rounded-r-none": preview && !isDragging,
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
            <div className="relative group w-fit mx-auto">
              <img
                src={preview}
                alt="Preview"
                className="max-w-60 aspect-square rounded-lg border shadow-sm object-center bg-muted"
              />
              <Button
                size="icon-sm"
                variant="destructive"
                className="absolute top-2 right-2 bg-white/80 rounded opacity-50 group-hover:opacity-100 transition-all hover:bg-white "
                onClick={removePreview}>
                <LuTrash2 className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
