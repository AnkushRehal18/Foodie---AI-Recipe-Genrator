"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RingLoader } from "react-spinners";

export default function ImageUploader({ onImageSelect, loading }) {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const onDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (!file) return;

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Pass file to parent
            onImageSelect(file);
        },
        [onImageSelect]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        maxFiles: 1,
        maxSize: 10485760, // 10MB
        noClick: true,
        noKeyboard: true,
    });

    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onDrop([file]);
        }
    };

    const clearImage = () => {
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Preview Mode
    if (preview) {
        return (
            <div className="relative w-full aspect-video bg-stone-100 rounded-2xl overflow-hidden border border-stone-200">
                <Image
                    src={preview}
                    alt="Pantry preview"
                    fill
                    className="object-cover"
                />
                {!loading && (
                    <button
                        onClick={clearImage}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all"
                    >
                        <X className="w-4 h-4 text-stone-700" />
                    </button>
                )}
                {loading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                        <RingLoader color="#ea580c" size={48} />
                        <p className="text-white text-sm font-medium">Analyzing your pantry...</p>
                    </div>
                )}
            </div>
        );
    }

    // Upload Mode
    return (
        <>
            <div
                {...getRootProps()}
                className={`relative w-full border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${
                    isDragActive
                        ? "border-orange-500 bg-orange-50 scale-[1.01]"
                        : "border-stone-200 bg-stone-50 hover:border-orange-400 hover:bg-orange-50/40"
                }`}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center gap-3 py-8 px-6 text-center">
                    {/* Icon */}
                    <div
                        className={`p-3 rounded-full transition-all ${
                            isDragActive ? "bg-orange-600 scale-110" : "bg-orange-100"
                        }`}
                    >
                        {isDragActive ? (
                            <ImageIcon className="w-6 h-6 text-white" />
                        ) : (
                            <Camera className="w-6 h-6 text-orange-600" />
                        )}
                    </div>

                    {/* Text */}
                    <div>
                        <p className="text-sm font-semibold text-stone-800">
                            {isDragActive ? "Drop your image here" : "Drag & drop a photo here"}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                            {isDragActive ? "Release to upload" : "JPG, PNG, WebP • Max 10MB"}
                        </p>
                    </div>

                    {/* Buttons */}
                    {!isDragActive && (
                        <div className="flex gap-2 mt-1">
                            <Button
                                type="button"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5 text-xs h-8 px-3"
                            >
                                <Camera className="w-3.5 h-3.5" />
                                Take Photo
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    open();
                                }}
                                className="border-stone-200 text-stone-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 gap-1.5 text-xs h-8 px-3"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                Browse
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden file input with capture attribute for mobile */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInputChange}
                className="hidden"
            />
        </>
    );
}