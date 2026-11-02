import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

export const ImageUpload = ({
  files,
  setFiles,
  maxFiles = 5,
  existingImages = [],
  onRemoveExisting,
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (newFiles) => {
    setError('');
    const validFiles = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    const totalCount =
      existingImages.length + files.length + newFiles.length;
    if (totalCount > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    for (const file of newFiles) {
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, JPEG, PNG, and WEBP formats are accepted.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 5MB size limit.`);
        return;
      }
      validFiles.push(file);
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#8B45E8] bg-[#F1E9FA]'
            : 'border-[#E8E8ED] bg-[#F7F7FA] hover:border-[#8B45E8]/40 hover:bg-[#F1E9FA]/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFiles(Array.from(e.target.files));
            }
          }}
        />
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-[#8B45E8] mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-[#252525]">
            Click to upload photograph <span className="font-normal text-[#858585]">or drag & drop</span>
          </p>
          <p className="text-xs text-[#858585] mt-1">
            JPG, PNG or WEBP (Max 5MB each, up to {maxFiles} images)
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-[#E84383] bg-[#FDECF3] p-2.5 rounded-xl border border-[#E84383]/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Previews (Existing + Newly selected) */}
      {(existingImages.length > 0 || files.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Existing images */}
          {existingImages.map((img, i) => (
            <div
              key={`existing-${i}`}
              className="relative aspect-video rounded-xl overflow-hidden border border-[#E8E8ED] bg-white group shadow-sm"
            >
              <img
                src={img.url}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(img.publicId)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#E84383] transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                Saved
              </span>
            </div>
          ))}

          {/* Newly staged files */}
          {files.map((file, i) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div
                key={`staged-${i}`}
                className="relative aspect-video rounded-xl overflow-hidden border border-[#8B45E8]/30 bg-[#F1E9FA] group shadow-sm"
              >
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#E84383] transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1 left-1 bg-[#8B45E8] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                  New
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

