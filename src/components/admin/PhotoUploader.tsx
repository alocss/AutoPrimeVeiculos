"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PhotoUploader({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        uploaded.push(data.url);
      } else {
        toast.error(`Falha ao enviar ${file.name}`);
      }
    }

    onChange([...photos, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...photos];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((url, i) => (
          <div key={url + i} className={cn("group relative aspect-[4/3] overflow-hidden rounded-lg border", i === 0 ? "border-primary-500" : "border-surface-border")}>
            <Image src={url} alt={`Foto ${i + 1}`} fill sizes="150px" className="object-cover" />
            {i === 0 ? (
              <span className="absolute left-1 top-1 rounded bg-primary-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Capa
              </span>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-white disabled:opacity-30" aria-label="Mover para a esquerda">
                ◀
              </button>
              <button type="button" onClick={() => remove(i)} className="rounded p-1 text-white" aria-label="Remover foto">
                ✕
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === photos.length - 1} className="rounded p-1 text-white disabled:opacity-30" aria-label="Mover para a direita">
                ▶
              </button>
            </div>
          </div>
        ))}

        <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-surface-border text-ink-400 hover:border-primary-400 hover:text-primary-600">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-medium">{uploading ? "Enviando..." : "Adicionar fotos"}</span>
        </label>
      </div>
      <p className="mt-2 text-xs text-ink-400">
        A primeira foto é usada como capa nos cards. Passe o mouse sobre uma foto para reordenar ou remover.
      </p>
    </div>
  );
}
