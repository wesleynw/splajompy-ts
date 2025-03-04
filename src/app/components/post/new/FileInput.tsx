import { Image as ImageIcon } from "@phosphor-icons/react";

interface FileInputProps {
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  setError: (error: string | null) => void;
}

export default function FileInput({
  multiple = false,
  onFilesSelected,
  setError,
}: Readonly<FileInputProps>) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const maxSizeInBytes = 20 * 1024 * 1024; // 20MB

    if (files.length === 0) return;

    const validFiles: File[] = [];
    let hasError = false;

    // Validate files
    for (const file of files) {
      // Check file size
      if (file.size > maxSizeInBytes) {
        setError(`File ${file.name} exceeds 20MB size limit.`);
        hasError = true;
        break;
      }

      // Check file type
      if (file.type.split("/")[0] !== "image") {
        setError(`File ${file.name} must be an image.`);
        hasError = true;
        break;
      }

      validFiles.push(file);
    }

    if (!hasError && validFiles.length > 0) {
      setError(null);
      onFilesSelected(validFiles);
    }

    // Reset input
    event.target.value = "";
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id="file-upload"
        accept="image/*"
        multiple={multiple}
      />
      <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
        <ImageIcon size={25} className="ml-5" />
      </label>
    </div>
  );
}
