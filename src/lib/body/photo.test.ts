import { describe, expect, it } from 'vitest'
import { isOwnPhotoPath, photoPath } from './photo'

const me = '11111111-2222-3333-4444-555555555555'
const other = '99999999-8888-7777-6666-555555555555'
const id = 'abcdef01-2345-6789-abcd-ef0123456789'

describe('isOwnPhotoPath (server-side guard for photo actions)', () => {
  it('accepts paths made by photoPath for the same user', () => {
    expect(isOwnPhotoPath(photoPath(me, id), me)).toBe(true)
  })
  it("rejects other users' folders and anything that isn't exactly user/uuid.jpg", () => {
    for (const p of [
      photoPath(other, id),
      `${me}/../${other}/${id}.jpg`,
      `${me}/${id}.png`,
      `${me}/${id}.jpg.exe`,
      `x${me}/${id}.jpg`,
      `${me}/sub/${id}.jpg`,
      `${me}/${id}`,
      '',
    ])
      expect(isOwnPhotoPath(p, me), p).toBe(false)
  })
})
