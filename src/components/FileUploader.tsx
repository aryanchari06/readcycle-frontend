"use client";

import { UploadButton } from "@/utils/uploadThing";
import { useState } from "react";

export default function FileUploader({
  onUpload,
  className,
}: {
  onUpload: (url: string) => void;
  className?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className={`p-4 border-gray-300 rounded-md ${className} `}>
      <UploadButton
        endpoint="bookImageUploader"
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          if (res && res[0]?.url) {
            console.log("uploaded", res[0].url);
            onUpload(res[0].url);
          }
        }}
        onUploadBegin={() => setIsUploading(true)}
        onUploadError={(error) => {
          setIsUploading(false);
          console.error("Upload failed:", error);
        }}
        className="w-full py-3 px-4 bg-[#5D4037] text-white font-medium rounded-md hover:bg-[#4E342E] transition"
        disabled={isUploading}
      />
      {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
