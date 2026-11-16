/**
 * Browser-side photo preparation for progress photos: decode, scale to at most `maxSide` px and
 * re-encode as JPEG. Re-encoding through a canvas drops all EXIF metadata — including GPS location
 * and camera serials — before anything leaves the device.
 */
export async function preparePhoto(file: File, maxSide = 1600, quality = 0.85): Promise<Blob> {
  const bitmap = await decode(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')
  ctx.drawImage(bitmap, 0, 0, w, h)
  if ('close' in bitmap) bitmap.close()
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', quality))
  if (!blob) throw new Error('encode')
  return blob
}

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // honours the EXIF orientation so portrait phone photos are not rotated
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      /* fall through (e.g. HEIC in browsers without a decoder) */
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Storage key inside the user's private folder. The first folder must be the user id (storage RLS). */
export const photoPath = (userId: string, id: string) => `${userId}/${id}.jpg`

/** Only keys in the caller's own folder with the expected shape are accepted by the server. */
export function isOwnPhotoPath(path: string, userId: string): boolean {
  return new RegExp(`^${userId}/[0-9a-f-]{36}\\.jpg$`).test(path)
}
