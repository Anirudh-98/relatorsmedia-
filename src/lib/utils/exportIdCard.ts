import { toPng } from "html-to-image";
import { convertUrlToDataUrl } from "./imageUtils";

// CR80 portrait canvas used by RealtorsMediaIdCard
const CARD_WIDTH = 638;
const CARD_HEIGHT = 1016;

/**
 * Renders an ID card element to a 300 DPI PNG data URL.
 *
 * `photo` must be the photo the preview is showing. It is inlined as a data URL for the
 * render (so html-to-image can never reuse a previously fetched image), and the preview's
 * original src is restored afterwards so no stale image is left behind for the next export.
 */
export async function renderIdCardPng(cardElement: HTMLElement, photo?: string): Promise<string> {
  const photoImg = cardElement.querySelector<HTMLImageElement>('img[data-profile-photo="true"]');
  const originalSrc = photoImg?.getAttribute("src") ?? null;

  try {
    if (photoImg && photo) {
      const inlined = await convertUrlToDataUrl(photo);
      if (inlined.startsWith("data:")) {
        photoImg.src = inlined;
        await photoImg.decode().catch(() => { });
      }
    }

    return await toPng(cardElement, {
      quality: 1,
      pixelRatio: 3, // 1914 x 3048px for crisp physical printing
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      cacheBust: true,
      includeQueryParams: true,
      style: {
        transform: "none",
        transformOrigin: "top left",
        position: "relative",
        left: "0",
        top: "0",
        borderRadius: "36px",
        clipPath: "inset(0 round 36px)",
        boxShadow: "none",
      },
    });
  } finally {
    if (photoImg && originalSrc !== null && photoImg.getAttribute("src") !== originalSrc) {
      photoImg.setAttribute("src", originalSrc);
    }
  }
}

/** Opens the browser print dialog for a rendered card at exact CR80 size (54mm x 86mm). */
export function printIdCardPng(dataUrl: string, title: string) {
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, { position: "fixed", right: "0", bottom: "0", width: "0", height: "0", border: "none" });
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    iframe.remove();
    throw new Error("Could not open print frame");
  }

  const safeTitle = title.replace(/[<>&"]/g, "");
  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html><html><head><title>${safeTitle}</title>
    <style>
      @page { size: 54mm 86mm; margin: 0; }
      html, body { margin: 0; padding: 0; width: 54mm; height: 86mm; background: #FFFFFF; overflow: hidden; }
      img { width: 54mm; height: 86mm; display: block; border-radius: 3.5mm;
            -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    </style></head>
    <body><img src="${dataUrl}" alt="Realtors Media ID Card" />
    <script>
      window.onload = function() {
        setTimeout(function() {
          window.focus();
          window.print();
          setTimeout(function() { try { window.parent.document.body.removeChild(window.frameElement); } catch(e) {} }, 1200);
        }, 300);
      };
    </script></body></html>`);
  iframeDoc.close();
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
