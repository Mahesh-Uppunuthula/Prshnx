import { useState } from "react";
import { useUserAssetFolders } from "@/hooks/use-assets";
import { Spinner } from "./ui/spinner";
import { LuFolder } from "react-icons/lu";
import FolderImages from "./FolderImages";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface GalleryProps {
  onSelect?: (imageUrl: string | null) => void;
  selectedImageUrl?: string | null;
}

function Gallery({ onSelect, selectedImageUrl }: GalleryProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { data: folders, isLoading: isFetchingFolders } = useUserAssetFolders();

  if (isFetchingFolders) {
    return (
      <div className="w-full h-full flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-6">
      <div className="px-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer transition-colors hover:text-indigo-600"
                onClick={() => setSelectedFolder(null)}>
                folders
              </BreadcrumbLink>
            </BreadcrumbItem>
            {selectedFolder && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedFolder}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {selectedFolder ? (
        <FolderImages
          folderName={selectedFolder}
          onSelect={onSelect}
          selectedImageUrl={selectedImageUrl}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
          {!folders || folders.length === 0 ? (
            <div className="col-span-full py-10 text-center text-muted-foreground flex flex-col items-center gap-2">
              <LuFolder className="size-10 opacity-20" />
              <p>No folders found</p>
            </div>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.key}
                onClick={() => setSelectedFolder(folder?.name ?? null)}
                className="group relative flex flex-col items-center justify-center p-4 rounded-xl border bg-card hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer gap-3 shadow-sm hover:shadow-md">
                <div className="p-3 bg-muted group-hover:bg-indigo-100/50 rounded-full transition-colors">
                  <LuFolder className="size-8 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
                </div>
                <span className="text-sm font-medium text-center truncate w-full px-2">
                  {folder.name}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Gallery;
