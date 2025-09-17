import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export type InsertMultipleFilesProps = {
  value?: File[];                         // Controlado (opcional)
  onChange?: (files: File[]) => void;     // Callback al cambiar
  accept?: string[];                      // e.g., ["image/*", "application/pdf"]
  maxFiles?: number;                      // Máx cantidad de archivos
  maxFileSizeMB?: number;                 // Máx tamaño por archivo
  disabled?: boolean;
  label?: string;  
  name?: string;                          // Para integrarse con forms si lo necesitas
  className?: string;
};

// Helpers
const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes)) return "-";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

type Item = {
  id: string;
  file: File;
  kind: "image" | "pdf" | "other";
  previewUrl?: string; // solo para imágenes
};

const isImage = (f: File) => f.type.startsWith("image/");
const isPdf = (f: File) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

export const InsertMultipleFiles: React.FC<InsertMultipleFilesProps> = ({
  value,
  onChange,
  accept = ["image/*", "application/pdf"],
  maxFiles = 20,
  maxFileSizeMB = 25,
  disabled = false,  
  
  name,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const acceptAttr = useMemo(() => accept.join(","), [accept]);

  // Crear items con previews para mostrar
  const makePreviewItems = useCallback((files: File[]): Item[] => {
    return files.map((file) => ({
      id: fileKey(file), // clave estable
      file,
      kind: isImage(file) ? "image" : isPdf(file) ? "pdf" : "other",
      previewUrl: isImage(file) ? URL.createObjectURL(file) : undefined,
    }));
  }, []);

  // Revoca URLs que ya no se usan al reemplazar items
  const safelySetItems = useCallback((next: Item[]) => {
    setItems((prev) => {
      const nextIds = new Set(next.map((n) => n.id));
      prev.forEach((it) => {
        if (!nextIds.has(it.id) && it.previewUrl) URL.revokeObjectURL(it.previewUrl);
      });
      return next;
    });
  }, []);

  // Sync con `value` (fuente de verdad del form) — sin “delay” visual
  useEffect(() => {
    const files = value ?? [];
    const next = makePreviewItems(files);
    safelySetItems(next);
  }, [value, makePreviewItems, safelySetItems]);

  // Dedup y validación
  const dedupe = (arr: File[]) => {
    const seen = new Set<string>();
    const out: File[] = [];
    for (const f of arr) {
      const key = fileKey(f);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(f);
      }
    }
    return out;
  };

  const validate = (files: File[]): { valid: File[]; errs: string[] } => {
    const errs: string[] = [];
    const valid: File[] = [];
    const maxBytes = maxFileSizeMB * 1024 * 1024;

    for (const f of files) {
      const typeOk =
        accept.length === 0 ||
        (accept.includes("image/*") && isImage(f)) ||
        (accept.includes("application/pdf") && isPdf(f)) ||
        accept.includes(f.type);

      if (!typeOk) {
        errs.push(`Tipo no permitido: ${f.name}`);
        continue;
      }
      if (f.size > maxBytes) {
        errs.push(`Excede ${maxFileSizeMB}MB: ${f.name}`);
        continue;
      }
      valid.push(f);
    }
    return { valid, errs };
  };

  // Mutadores: actualizan RHF y la vista inmediatamente
const addFiles = (filesLike: FileList | File[]) => {
  const incoming = Array.from(filesLike);
  const deduped = dedupe(incoming);
  const { valid, errs } = validate(deduped);
  setErrors(errs);

  const nextFiles = [...(value ?? []), ...valid].slice(0, maxFiles);

  // 👇 Actualiza RHF
  onChange?.(nextFiles);

  // 👇 Actualiza inmediatamente la vista
  safelySetItems(makePreviewItems(nextFiles));
};

const removeAt = (id: string) => {
  const nextFiles = (value ?? []).filter((f) => fileKey(f) !== id);

  // 👇 Actualiza RHF
  onChange?.(nextFiles);

  // 👇 Actualiza inmediatamente la vista
  safelySetItems(makePreviewItems(nextFiles));
};


  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    const dt = e.dataTransfer;
    if (dt?.files && dt.files.length) addFiles(dt.files);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) addFiles(e.target.files);
    e.currentTarget.value = ""; // permite volver a elegir los mismos archivos
  };

  const canAdd = !disabled && items.length < maxFiles;

  // Cleanup al desmontar: revoca todas las URLs
  useEffect(() => {
    return () => {
      items.forEach((it) => it.previewUrl && URL.revokeObjectURL(it.previewUrl));
    };
  }, [items]);

  return (
    <div className={`w-[90%] max-w-5xl mx-auto ${className ?? ""}`}>
      {/* Dropzone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`group relative rounded-2xl border-2 border-dashed ${disabled ? "border-gray-300" : "border-gray-400 hover:border-blue-500"} bg-white p-6 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={acceptAttr}
          multiple
          disabled={disabled}
          onChange={onPick}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="rounded-full p-3 bg-gray-100 group-hover:bg-blue-50 transition-colors">
            <Icon icon="material-symbols:cloud-upload" width="36" height="36" className="text-gray-600 group-hover:text-blue-600" />
          </div>
          <p className="text-gray-800 font-medium">
            Arrastra y suelta archivos aquí
          </p>
          
        </div>
      </div>

      {/* Errores */}
      {errors.length > 0 && (
        <ul className="mt-3 space-y-1">
          {errors.map((e, i) => (
            <li key={i} className="text-sm text-red-600 flex items-center gap-2">
              <Icon icon="material-symbols:error" width="18" height="18" />
              {e}
            </li>
          ))}
        </ul>
      )}

      {/* Grid de archivos */}
      {items.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">{items.length} archivo(s) seleccionado(s)</div>
            {canAdd && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-blue-700 hover:text-white border border-blue-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Icon icon="material-symbols:add-rounded" width="18" height="18" />
                Agregar más
              </button>
            )}
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 items-center justify-center">
            {items.map((it) => (
              <li key={it.id} className="relative group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Preview */}
                <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
                  {it.kind === "image" && it.previewUrl ? (
                    <img src={it.previewUrl} alt={it.file.name} className="h-full w-full object-cover" />
                  ) : it.kind === "pdf" ? (
                    <div className="flex flex-col items-center justify-center text-gray-600">
                      <Icon icon="mdi:file-pdf-box" width="56" height="56" className="text-red-600" />
                      <span className="text-xs mt-1">PDF</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-600">
                      <Icon icon="mdi:file" width="48" height="48" />
                      <span className="text-xs mt-1">Archivo</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="text-sm font-medium text-gray-800 truncate" title={it.file.name}>
                    {it.file.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span>{formatBytes(it.file.size)}</span>
                    <span>•</span>
                    <span className="uppercase">{it.file.type || it.kind}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => removeAt(it.id)}
                    className="inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-red-700 hover:text-red-800 shadow px-2 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Eliminar ${it.file.name}`}
                  >
                    <Icon icon="material-symbols:delete" width="20" height="20" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
