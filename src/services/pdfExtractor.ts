export async function extractTextFromPdf(file: File): Promise<string> {
  // Dynamically import pdfjs-dist to prevent breaking the main bundle on load
  const pdfjsLib = await import('pdfjs-dist');
  
  // Use Vite's recommended way to load the worker URL
  const pdfWorkerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = (content.items as any[]).map((item) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }
  return fullText.trim();
}
