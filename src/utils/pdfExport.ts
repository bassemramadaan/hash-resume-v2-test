import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export function waitForResumePreview(): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50;

    const check = () => {
      const element = document.getElementById("resume-preview-document");

      if (element) {
        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
          resolve(element);
          return;
        }
        if (element.children.length > 0) {
          resolve(element);
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
  const element = await waitForResumePreview();

  // Preserve scale & background
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.no-print').forEach((el) => el.remove());
  clone.style.display = "block";
  clone.style.visibility = "visible";
  clone.style.width = "210mm";
  clone.style.minHeight = "297mm";
  clone.style.transform = "none";
  clone.style.position = "fixed";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.zIndex = "-1000";
  document.body.appendChild(clone);
  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll('.no-print').forEach((el) => el.remove());
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
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfHeight;
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;
    }
    pdf.save(filename);
  } finally {
    document.body.removeChild(clone);
  }
}
