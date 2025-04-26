export const filterBase64 = (base64String?: string) => {
  if (!base64String) return '';
  if (base64String && base64String.startsWith('data:image/')) {
    const prefixEndIndex = base64String.indexOf(';base64,');
    if (prefixEndIndex !== -1) {
      return base64String.substring(prefixEndIndex + ';base64,'.length);
    }
  }
  return base64String;
};
