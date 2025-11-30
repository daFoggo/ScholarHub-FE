import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useUploadProfileMedia } from "../hooks/use-profile-media";

interface ImageUploadOverlayProps {
  mediaType: "avatar" | "banner";
  isCurrentUser: boolean;
  className?: string;
  children: React.ReactNode;
  onUploadStart?: () => void;
  onUploadComplete?: (filePath: string) => void;
}

export const ImageUploadOverlay = ({
  mediaType,
  isCurrentUser,
  className,
  children,
  onUploadStart,
  onUploadComplete,
}: ImageUploadOverlayProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadProfileMedia();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadStart?.();
    
    uploadMutation.mutate(
      { mediaType, file },
      {
        onSuccess: (data) => {
          onUploadComplete?.(data.file_path);
        },
      }
    );

    // Reset input
    event.target.value = "";
  };

  const handleClick = () => {
    if (!isCurrentUser || uploadMutation.isPending) return;
    fileInputRef.current?.click();
  };

  if (!isCurrentUser) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("group relative cursor-pointer", className)} onClick={handleClick}>
      {children}
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {uploadMutation.isPending ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Camera className="w-6 h-6 text-white" />
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}; 