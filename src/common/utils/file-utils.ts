export const MAX_BASE64_SIZE_BYTES = 6 * 1024 * 1024; // 6MB

export function validateBase64Size(
  base64: string,
  maxSizeBytes = MAX_BASE64_SIZE_BYTES,
): void {
  const sizeInBytes = Buffer.byteLength(base64, 'base64');
  if (sizeInBytes > maxSizeBytes) {
    const sizeMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    throw new Error(
      `Base64 file too large: ${sizeMB} MB (limit is ${maxSizeBytes / (1024 * 1024)} MB)`,
    );
  }
}
