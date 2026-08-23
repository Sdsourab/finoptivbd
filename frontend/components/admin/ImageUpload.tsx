"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("article-images").upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("article-images").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — check the article-images bucket exists and is public.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-small text-text-secondary">{label}</label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 h-32 w-auto rounded-md border border-white/10 object-cover" />
      )}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="text-small text-text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-bg-hover file:px-3 file:py-1.5 file:text-small file:text-text-primary"
        />
        {uploading && <span className="text-caption text-text-muted">Uploading…</span>}
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste an image URL directly"
        className="mt-2 w-full rounded-md border border-white/10 bg-bg-card px-3 py-2 text-small text-text-primary"
      />
      {error && <p className="mt-1 text-caption text-error">{error}</p>}
    </div>
  );
}