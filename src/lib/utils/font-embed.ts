let cachedFontEmbedCSS: string | null = null;

/**
 * Loads the brand fonts (Berthold Block, Good Time Script, TT Interphases)
 * and encodes them as base64 @font-face data URIs so that html-to-image
 * and canvas PDF generators can render custom brand typography reliably.
 */
export async function getFontEmbedCSS(): Promise<string> {
  if (cachedFontEmbedCSS) return cachedFontEmbedCSS;

  if (typeof window === 'undefined') return '';

  try {
    const blobToDataUrl = (blob: Blob): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

    const [bertholdBlob, scriptBlob, ttBoldBlob, ttSemiBlob, ttMedBlob, ttRegBlob] = await Promise.all([
      fetch('/fonts/blockberthold.otf').then((r) => r.blob()),
      fetch('/fonts/made-goodtime-script.otf').then((r) => r.blob()),
      fetch('/fonts/tt-interphases-bold.ttf').then((r) => r.blob()),
      fetch('/fonts/tt-interphases-demibold.ttf').then((r) => r.blob()),
      fetch('/fonts/tt-interphases-medium.ttf').then((r) => r.blob()),
      fetch('/fonts/tt-interphases-regular.ttf').then((r) => r.blob()),
    ]);

    const [bertholdData, scriptData, ttBoldData, ttSemiData, ttMedData, ttRegData] = await Promise.all([
      blobToDataUrl(bertholdBlob),
      blobToDataUrl(scriptBlob),
      blobToDataUrl(ttBoldBlob),
      blobToDataUrl(ttSemiBlob),
      blobToDataUrl(ttMedBlob),
      blobToDataUrl(ttRegBlob),
    ]);

    cachedFontEmbedCSS = `
      @font-face {
        font-family: 'Berthold Block';
        src: url('${bertholdData}') format('opentype');
        font-weight: 400 900;
        font-style: normal;
      }
      @font-face {
        font-family: 'Good Time Script';
        src: url('${scriptData}') format('opentype');
        font-weight: 400 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'TT Interphases';
        src: url('${ttBoldData}') format('truetype');
        font-weight: 700 800;
        font-style: normal;
      }
      @font-face {
        font-family: 'TT Interphases';
        src: url('${ttSemiData}') format('truetype');
        font-weight: 600;
        font-style: normal;
      }
      @font-face {
        font-family: 'TT Interphases';
        src: url('${ttMedData}') format('truetype');
        font-weight: 500;
        font-style: normal;
      }
      @font-face {
        font-family: 'TT Interphases';
        src: url('${ttRegData}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
    `;
    return cachedFontEmbedCSS;
  } catch (err) {
    console.warn('Failed to pre-embed fonts into CSS:', err);
    return '';
  }
}
