"use client";

import { useEffect } from "react";
import LegacyEditPage from "./LegacyEditPage";

async function normalizeImageFile(file: File): Promise<File> {
  const MAX_BYTES = 1024 * 1024;
  if (file.size <= MAX_BYTES) return file;

  const bitmap = await createImageBitmap(file);
  try {
    const maxDimension = 1800;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Browser tidak mendukung pemrosesan gambar.");

    ctx.drawImage(bitmap, 0, 0, width, height);

    let quality = 0.82;
    let blob: Blob | null = null;

    while (quality >= 0.45) {
      blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );

      if (blob && blob.size <= MAX_BYTES) break;
      quality -= 0.07;
    }

    if (!blob || blob.size > MAX_BYTES) {
      throw new Error("Gambar terlalu besar untuk diproses otomatis. Silakan pilih gambar yang lebih kecil.");
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "gallery-image";
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}

function replaceInputFile(input: HTMLInputElement, file: File) {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  input.files = dataTransfer.files;
}

function ThemeUploadGuard() {
  useEffect(() => {
    let timer: number | null = null;
    const previewUrls = new Set<string>();

    const isThemeStep = () => {
      const text = document.body.textContent || "";
      return text.includes("Pilih Tema Undangan") && text.includes("Pengaturan Khusus Tema Ini");
    };

    const hasPendingUpload = () => {
      if (!isThemeStep()) return false;
      return Array.from(document.querySelectorAll("p")).some((node) =>
        /Mengunggah gambar/i.test(node.textContent || "")
      );
    };

    const getNextButton = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      const button = element?.closest("button");
      if (!button) return null;
      return /^\s*Lanjut\s*/i.test(button.textContent || "") ? button : null;
    };

    const showLocalPreview = (input: HTMLInputElement, file: File) => {
      const localUrl = URL.createObjectURL(file);
      previewUrls.add(localUrl);

      const row = input.closest(".flex.items-center.gap-3") || input.parentElement?.parentElement;
      if (!row) return;

      let image = row.querySelector("img") as HTMLImageElement | null;
      if (!image) {
        const wrapper = document.createElement("div");
        wrapper.className = "w-12 h-12 rounded-none border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 bg-slate-100";

        image = document.createElement("img");
        image.alt = "Preview gambar";
        image.className = "w-full h-full object-cover";
        wrapper.appendChild(image);

        const inputContainer = input.parentElement;
        if (inputContainer) {
          row.insertBefore(wrapper, inputContainer);
        } else {
          row.prepend(wrapper);
        }
      }

      const previousLocalUrl = image.dataset.localPreviewUrl;
      if (previousLocalUrl) {
        URL.revokeObjectURL(previousLocalUrl);
        previewUrls.delete(previousLocalUrl);
      }

      image.dataset.localPreviewUrl = localUrl;
      image.src = localUrl;
    };

    const onFileChangeCapture = (event: Event) => {
      if (!isThemeStep()) return;

      const input = event.target instanceof HTMLInputElement ? event.target : null;
      if (!input || input.type !== "file" || !input.files?.[0]) return;
      if (!input.accept.includes("image/")) return;

      const file = input.files[0];
      if (!file.type.startsWith("image/")) return;

      // The legacy editor limits uploads to 1 MB. Mobile photos are often
      // larger, so normalize them before React's upload handler receives them.
      if (file.size > 1024 * 1024 && !input.dataset.normalizing) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        input.dataset.normalizing = "true";

        normalizeImageFile(file)
          .then((normalizedFile) => {
            replaceInputFile(input, normalizedFile);
            delete input.dataset.normalizing;
            input.dispatchEvent(new Event("change", { bubbles: true }));
          })
          .catch((error) => {
            delete input.dataset.normalizing;
            console.error("Theme image normalization failed:", error);
            input.dispatchEvent(new Event("change", { bubbles: true }));
          });

        return;
      }

      showLocalPreview(input, file);
    };

    const onClickCapture = (event: MouseEvent) => {
      const button = getNextButton(event.target);
      if (!button || !isThemeStep() || !hasPendingUpload()) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (timer !== null) window.clearInterval(timer);

      timer = window.setInterval(() => {
        if (hasPendingUpload()) return;

        if (timer !== null) {
          window.clearInterval(timer);
          timer = null;
        }

        // Give React one render cycle to commit custom_data.
        window.setTimeout(() => {
          button.click();
        }, 150);
      }, 100);
    };

    document.addEventListener("change", onFileChangeCapture, true);
    document.addEventListener("click", onClickCapture, true);

    return () => {
      document.removeEventListener("change", onFileChangeCapture, true);
      document.removeEventListener("click", onClickCapture, true);
      if (timer !== null) window.clearInterval(timer);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.clear();
    };
  }, []);

  return null;
}

export default function EditInvitationPage() {
  return (
    <>
      <ThemeUploadGuard />
      <LegacyEditPage />
    </>
  );
}
