import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { useExportGate } from "../store/useExportGate";

export function waitForResumePreview(): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50;

    const check = () => {
      // 1. First priority: Offscreen headless render source (clean 1:1, non-zoomed)
      const offscreenSource = document.getElementById("resume-export-source-document");
      if (offscreenSource && offscreenSource.children.length > 0) {
        resolve(offscreenSource);
        return;
      }

      // 2. Second priority: Standard preview document in the editor
      const previewElement = document.getElementById("resume-preview-document");
      if (previewElement) {
        if (previewElement.offsetWidth > 0 && previewElement.offsetHeight > 0) {
          resolve(previewElement);
          return;
        }
        if (previewElement.children.length > 0) {
          resolve(previewElement);
          return;
        }
      }

      attempts += 1;

      if (attempts >= maxAttempts) {
        reject(
          new Error("تعذر تجهيز معاينة السيرة الذاتية للتصدير. ارجع للمحرر وحاول مرة أخرى.")
        );
        return;
      }

      requestAnimationFrame(check);
    };

    check();
  });
}

export async function exportResumeToPdf(
  elementId: string = "resume-preview-document",
  filename: string = "Hash_Resume.pdf"
): Promise<void> {
  // Synchronous security verification: Confirm gate authorization is currently active
  const isGateAuthorized = useExportGate.getState().verifyAuthorization();
  if (!isGateAuthorized) {
    throw new Error("غير مصرح بتحميل السيرة الذاتية بدون تفعيل صالح. يرجى إتمام التحقق من الدفع.");
  }

  // Ensure document fonts are fully loaded to prevent font-substitution reflow
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore and proceed
    }
  }

  const element = await waitForResumePreview();

  // Create an isolated deterministic render sandbox container
  // Standard A4 at 96 CSS DPI: Width = 794px (~210mm), MinHeight = 1123px (~297mm)
  const A4_WIDTH_PX = 794;
  const A4_PAGE_HEIGHT_MM = 297;
  const A4_PAGE_WIDTH_MM = 210;

  const sandboxContainer = document.createElement("div");
  sandboxContainer.id = "hash-resume-pdf-sandbox";
  sandboxContainer.setAttribute("aria-hidden", "true");
  sandboxContainer.setAttribute("tabindex", "-1");
  sandboxContainer.style.position = "fixed";
  sandboxContainer.style.left = "0";
  sandboxContainer.style.top = "0";
  sandboxContainer.style.width = `${A4_WIDTH_PX}px`;
  sandboxContainer.style.minWidth = `${A4_WIDTH_PX}px`;
  sandboxContainer.style.maxWidth = `${A4_WIDTH_PX}px`;
  sandboxContainer.style.margin = "0";
  sandboxContainer.style.padding = "0";
  sandboxContainer.style.border = "none";
  sandboxContainer.style.zIndex = "-99999";
  sandboxContainer.style.opacity = "0";
  sandboxContainer.style.pointerEvents = "none";
  sandboxContainer.style.overflow = "visible";
  sandboxContainer.style.transform = "none";
  sandboxContainer.style.zoom = "1";
  sandboxContainer.style.backgroundColor = "#ffffff";

  // Deep clone the resume document content
  const clone = element.cloneNode(true) as HTMLElement;

  // Clean up any preview-only annotations / break indicators
  clone.querySelectorAll(".no-print").forEach((el) => el.remove());

  // Force deterministic sizing and neutralize preview-level container transforms on the clone root only.
  // Note: We deliberately do NOT strip transforms from children (icons, decorative SVGs, badges).
  clone.style.transform = "none";
  clone.style.zoom = "1";
  clone.style.width = `${A4_WIDTH_PX}px`;
  clone.style.minWidth = `${A4_WIDTH_PX}px`;
  clone.style.maxWidth = `${A4_WIDTH_PX}px`;
  clone.style.boxSizing = "border-box";
  clone.style.margin = "0";
  clone.style.display = "block";
  clone.style.visibility = "visible";

  sandboxContainer.appendChild(clone);
  document.body.appendChild(sandboxContainer);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2, // 2x high resolution for crisp text & graphics
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
      width: A4_WIDTH_PX,
      windowWidth: A4_WIDTH_PX, // Forces html2canvas internal iframe viewport to 794px (prevents responsive layout shifts)
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc, clonedEl) => {
        clonedDoc.querySelectorAll(".no-print").forEach((el) => el.remove());

        if (clonedEl instanceof HTMLElement) {
          clonedEl.style.transform = "none";
          clonedEl.style.zoom = "1";
          clonedEl.style.width = `${A4_WIDTH_PX}px`;
          clonedEl.style.minWidth = `${A4_WIDTH_PX}px`;
          clonedEl.style.maxWidth = `${A4_WIDTH_PX}px`;
        }

        // Modern CSS color compatibility converter (Oklch fallback)
        const oklchRegex = /oklch\([^)]+\)/gi;
        const tempCanvas = clonedDoc.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");
        if (ctx) {
          clonedDoc.querySelectorAll("style").forEach((styleEl) => {
            if (styleEl.textContent && oklchRegex.test(styleEl.textContent)) {
              styleEl.textContent = styleEl.textContent.replace(oklchRegex, (match) => {
                try {
                  ctx.fillStyle = match;
                  return ctx.fillStyle || "#0B1120";
                } catch {
                  return "#0B1120";
                }
              });
            }
          });
          clonedDoc.querySelectorAll("*").forEach((node) => {
            const htmlNode = node as HTMLElement;
            if (htmlNode.style && htmlNode.style.cssText && oklchRegex.test(htmlNode.style.cssText)) {
              htmlNode.style.cssText = htmlNode.style.cssText.replace(oklchRegex, (match) => {
                try {
                  ctx.fillStyle = match;
                  return ctx.fillStyle || "#0B1120";
                } catch {
                  return "#0B1120";
                }
              });
            }
          });
        }
      },
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const totalPdfHeight = (canvas.height * A4_PAGE_WIDTH_MM) / canvas.width;
    // Calculate total pages with a subpixel 2mm threshold
    const totalPages = Math.max(1, Math.ceil((totalPdfHeight - 2) / A4_PAGE_HEIGHT_MM));

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }
      const yOffset = -(page * A4_PAGE_HEIGHT_MM);
      pdf.addImage(imgData, "PNG", 0, yOffset, A4_PAGE_WIDTH_MM, totalPdfHeight, undefined, "FAST");
    }

    pdf.save(filename);
  } finally {
    if (sandboxContainer && sandboxContainer.parentNode) {
      sandboxContainer.parentNode.removeChild(sandboxContainer);
    }
    // Defensive cleanup in case of duplicate instances
    document.querySelectorAll("#hash-resume-pdf-sandbox").forEach((el) => el.remove());
  }
}
