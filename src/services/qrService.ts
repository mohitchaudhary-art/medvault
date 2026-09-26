import QRCode from 'qrcode';

export const generateQRCodeDataURL = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      width: 250,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    return '';
  }
};
