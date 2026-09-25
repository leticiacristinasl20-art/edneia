// Client-side image optimizer to allow uploading dozens of high-res photos
// without exhausting localStorage / memory quotas.

export interface ProcessedPhoto {
  id: string;
  url: string;
  name: string;
  title: string;
  caption: string;
  tag: string;
  size: number;
}

export async function processImageFile(file: File, defaultTag: string = 'Família'): Promise<ProcessedPhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Max dimension 1400px (crystal clear on Retina/high-res screens, ~150-250KB JPEG)
        const maxDimension = 1400;
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // fallback to raw data
          resolve({
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: e.target?.result as string,
            name: file.name,
            title: cleanFileName(file.name),
            caption: 'Momento inesquecível ao lado de quem tanto amamos.',
            tag: defaultTag,
            size: file.size,
          });
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-quality JPEG
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.86);

        resolve({
          id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url: optimizedDataUrl,
          name: file.name,
          title: cleanFileName(file.name),
          caption: 'Momento inesquecível ao lado de quem tanto amamos.',
          tag: defaultTag,
          size: Math.round(optimizedDataUrl.length * 0.75),
        });
      };

      img.onerror = () => reject(new Error(`Falha ao carregar a imagem: ${file.name}`));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error(`Falha ao ler o arquivo: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function cleanFileName(fileName: string): string {
  // Strip extension and replace hyphens/underscores
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  const clean = withoutExt.replace(/[_-]+/g, ' ').trim();
  if (!clean || clean.length < 2) return 'Momento Especial';
  // Capitalize
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}
