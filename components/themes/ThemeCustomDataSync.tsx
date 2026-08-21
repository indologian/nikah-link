"use client";

import { useEffect } from "react";

interface Props {
  themeKey?: string | null;
  customData?: Record<string, unknown> | null;
}

const DEFAULT_TERRACOTTA_QUOTE =
  "Cinta sejati tidak datang kepada Anda. Itu harus tumbuh dari dalam hati dan menemukan pasangannya.";

export default function ThemeCustomDataSync({ themeKey, customData }: Props) {
  useEffect(() => {
    if (themeKey !== "terracotta-rust") return;

    const galleryKeys = ["gallery_1", "gallery_2", "gallery_3"] as const;

    const sync = () => {
      const root = document.querySelector("[data-nikahlink-theme]");
      if (!root) return;

      const quote = typeof customData?.quote === "string" ? customData.quote.trim() : "";
      if (quote) {
        root.querySelectorAll("p").forEach((node) => {
          if (node.textContent?.trim() === DEFAULT_TERRACOTTA_QUOTE) {
            node.textContent = quote;
          }
        });
      }

      const galleryHeading = Array.from(root.querySelectorAll("h3")).find(
        (node) => node.textContent?.trim() === "Galeri Cinta"
      );
      const gallerySection = galleryHeading?.closest("section");
      if (!gallerySection) return;

      const images = Array.from(gallerySection.querySelectorAll("img"));
      galleryKeys.forEach((key, index) => {
        const url = typeof customData?.[key] === "string" ? customData[key] : "";
        if (!url || !images[index]) return;

        const image = images[index];
        if (image.src !== url) image.src = url;
        image.removeAttribute("srcset");
        image.removeAttribute("sizes");
      });
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [themeKey, customData]);

  return null;
}
