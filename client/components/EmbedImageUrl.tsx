import React, { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { EmbedImageUrlState } from "./ImportImage";

const IMAGE_URL_REGEX = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;

interface EmbedImageUrlProps {
  onChange?: (state: EmbedImageUrlState) => void;
}

function EmbedImageUrl({ onChange }: EmbedImageUrlProps) {
  const [url, setUrl] = useState("");

  const isValidUrl = useMemo(() => {
    if (url.length <= 0) return false;
    return IMAGE_URL_REGEX.test(url);
  }, [url]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newUrl = e.target.value;
    setUrl(newUrl);
    onChange?.({
      type: "embed",
      valid: IMAGE_URL_REGEX.test(newUrl),
      payload: { url: newUrl },
    });
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const newUrl = e.target.value;
    setUrl(newUrl);
    onChange?.({
      type: "embed",
      valid: IMAGE_URL_REGEX.test(newUrl),
      payload: { url: newUrl },
    });
  }

  function handleClear() {
    setUrl("");
    onChange?.({ type: "embed", valid: false, payload: { url: "" } });
  }

  return (
    <div className="w-full h-full p-2 flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-col gap-2">
        <Label htmlFor="image-url" className="text-sm font-medium">
          Image URL
        </Label>
        <div className="flex gap-2 place-items-center">
          <Input
            id="image-url"
            type="url"
            placeholder="Paste image URL"
            value={url}
            onChange={handleOnChange}
            onBlur={handleBlur}
          />
          <Button
            disabled={!url.length}
            variant="secondary"
            size="icon"
            className="h-full rounded"
            onClick={handleClear}>
            <X />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 border rounded-xl flex justify-center items-center bg-muted/20">
        {isValidUrl ? (
          <img
            src={url}
            className="w-full h-full object-contain rounded-xl"
            alt="Preview"
          />
        ) : (
          <p className="text-muted-foreground">No image selected</p>
        )}
      </div>
    </div>
  );
}

export default EmbedImageUrl;
