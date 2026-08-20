"use client";

import { useEffect } from "react";
import LegacyEditPage from "./LegacyEditPage";

function ThemeUploadGuard() {
  useEffect(() => {
    let timer: number | null = null;

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

        // Give React one render cycle to commit custom_data.<br>
        window.setTimeout(() => {
          button.click();
        }, 150);
      }, 100);
    };

    document.addEventListener("click", onClickCapture, true);

    return () => {
      document.removeEventListener("click", onClickCapture, true);
      if (timer !== null) window.clearInterval(timer);
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
