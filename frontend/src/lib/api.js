export async function analyzePdf(file) {
  const formData = new FormData();
  formData.append('file', file);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const response = await fetch(`${baseUrl}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Analyze request failed: ${response.status} ${text}`);
  }

  // Expected shape:
  // {
  //   originalText: string,
  //   simplifiedText: string,
  //   stats?: { complexityReduction?: number, keyPoints?: number, readingSpeedGain?: number }
  // }
  const data = await response.json();
  return data;
}
