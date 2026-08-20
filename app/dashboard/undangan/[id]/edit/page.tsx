"use client";

import { useEffect } from "react";
import LegacyEditPage from "./LegacyEditPage";

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

    // The legacy editor only renders the thumbnail from custom_data, which is
    // updated after the async Supabase upload finishes. Show the selected
    // local file immediately so replacing an existing image is visually clear.
    const onFileChangeCapture = (event: Event) => {
      if (!isThemeStep()) return;

      const input = event.target instanceof HTMLInputElement ? event.target : null;
      if (!input || input.type !== "file" || !input.files?.[0]) return;
      if (!input.accept.includes("image/")) return;

      const file = input.files[0];
      if (!file.type.startsWith("image/")) return;

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
