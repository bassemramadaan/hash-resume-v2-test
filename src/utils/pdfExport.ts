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
  _elementId: string = "resume-preview-document",
  filename: string = "Hash_Resume.pdf"
): Promise<void> {
  // 1. Security verification: Confirm gate authorization is currently active
  const isGateAuthorized = useExportGate.getState().verifyAuthorization();
  if (!isGateAuthorized) {
    throw new Error("غير مصرح بتحميل السيرة الذاتية بدون تفعيل صالح. يرجى إتمام التحقق من الدفع.");
  }

  // 2. Locate source resume document
  const sourceElement = await waitForResumePreview();

  // 3. Create dedicated off-screen export container with a fixed A4 layout
  const exportNode = document.createElement("div");
  exportNode.className = "pdf-export-container";
  exportNode.id = "dedicated-pdf-export-container";
  exportNode.style.position = "absolute";
  exportNode.style.left = "-100000px";
  exportNode.style.top = "0";
  exportNode.style.width = "210mm";
  exportNode.style.minHeight = "297mm";
  exportNode.style.boxSizing = "border-box";
  exportNode.style.background = "#ffffff";
  exportNode.style.overflow = "visible";
  exportNode.style.maxHeight = "none";
  exportNode.style.transform = "none";
  exportNode.style.zoom = "1";

  // Deep clone current resume data and selected template into export container
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  clone.classList.add("resume-page");
  clone.style.width = "210mm";
  clone.style.minHeight = "297mm";
  clone.style.boxSizing = "border-box";
  clone.style.overflow = "visible";
  clone.style.maxHeight = "none";
  clone.style.transform = "none";
  clone.style.zoom = "1";

  // Remove any preview-only annotations or page break guidelines
  clone.querySelectorAll(".no-print").forEach((el) => el.remove());

  exportNode.appendChild(clone);
  document.body.appendChild(exportNode);

  try {
    // 4. Wait for fonts and images
    if (typeof document !== "undefined" && "fonts" in document) {
      try {
        await document.fonts.ready;
      } catch {
        // ignore and continue
      }
    }

    await Promise.all(
      Array.from(exportNode.querySelectorAll("img")).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // 5. Capture with html2canvas using dedicated export node
    const canvas = await html2canvas(exportNode, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: exportNode.scrollWidth,
      height: exportNode.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      logging: false,
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll(".no-print").forEach((el) => el.remove());

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

    if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
      throw new Error("فشل توليد صورة السيرة الذاتية بدقة صالحة. يرجى المحاولة مرة أخرى.");
    }

    // 6. Generate an A4 portrait PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // 7. Scale canvas proportionally to A4 page dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 8;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;
    const imageHeight = (canvas.height * usableWidth) / canvas.width;
    const imgData = canvas.toDataURL("image/png", 1.0);

    // 8. Multi-page slice handling
    if (imageHeight <= usableHeight) {
      // Fits within a single A4 page
      pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imageHeight, undefined, "FAST");
    } else {
      // Multi-page export: slice without distorting or compressing text
      const totalPages = Math.max(1, Math.ceil((imageHeight - 2) / usableHeight));
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        const yOffset = margin - page * usableHeight;
        pdf.addImage(imgData, "PNG", margin, yOffset, usableWidth, imageHeight, undefined, "FAST");
      }
    }

    const safeFilename = (filename || 'Hash_Resume.pdf').replace(/[/\\?%*:|"<>]/g, '_');
    pdf.save(safeFilename);
  } finally {
    // 9. Guarantee cleanup of export node in all cases
    if (exportNode && exportNode.parentNode) {
      exportNode.remove();
    }
  }
}
