import { ResumeData, Language } from '../types/resume';

export async function parseResumeFile(
  file: File,
  language: Language = 'ar'
): Promise<ResumeData> {
  // 1. If JSON file, parse directly
  if (file.type === 'application/json' || file.name.endsWith('.json')) {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.personalInfo || data.experiences) {
      return data as ResumeData;
    }
  }

  // 2. Convert to Base64 for PDF or other documents
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  // 3. Call server parser API
  const res = await fetch('/api/ai/parse-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base64Data,
      mimeType: file.type || 'application/pdf',
      language,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to parse uploaded CV file');
  }

  const result = await res.json();
  if (result.success && result.resumeData) {
    return result.resumeData as ResumeData;
  }

  throw new Error('Unable to extract data from uploaded file');
}
