import { environments } from '@/constants/environments'
import { v2 as cloudinary } from 'cloudinary'

// Cloudinary configuration
cloudinary.config({
  cloud_name: environments.CLOUDINARY_CLOUD_NAME,
  api_key: environments.CLOUDINARY_API_KEY,
  api_secret: environments.CLOUDINARY_API_SECRET,
})

// Types
export interface UploadResult {
  public_id: string
  secure_url: string
  url: string
  width: number
  height: number
  format: string
  bytes: number
}

export interface DeleteResult {
  result: string
}

// Error handling
export class CloudinaryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CloudinaryError'
  }
}

// Upload image from File, Buffer, or Base64 string
export const uploadImage = async (
  file: File | Buffer | string,
  folder?: string
): Promise<UploadResult> => {
  try {
    const options: any = {
      resource_type: 'auto',
      overwrite: true,
    }

    if (folder) {
      options.folder = folder
    }

    let result

    if (typeof file === 'string') {
      // Base64 string
      result = await cloudinary.uploader.upload(file, options)
    } else if (Buffer.isBuffer(file)) {
      // Buffer
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(options, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          })
          .end(file)
      })
    } else {
      // File object
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(options, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          })
          .end(buffer)
      })
    }

    return result as UploadResult
  } catch (error: any) {
    throw new CloudinaryError(error.message || 'Failed to upload image')
  }
}

// Upload user avatar
export const uploadAvatar = async (
  file: File | Buffer | string,
  userId: string
): Promise<UploadResult> => {
  return uploadImage(file, `cookmate/avatars/${userId}`)
}

// Upload ingredient image
export const uploadIngredientImage = async (
  file: File | Buffer | string,
  userId: string
): Promise<UploadResult> => {
  return uploadImage(file, `cookmate/ingredients/${userId}`)
}

// Upload community post image
export const uploadCommunityImage = async (
  file: File | Buffer | string,
  postId: string,
  userId: string
): Promise<UploadResult> => {
  return uploadImage(file, `cookmate/community/${userId}`)
}

// Get image URL with transformations
export const getImageUrl = (
  publicId: string,
  width?: number,
  height?: number,
  crop?: string
): string => {
  const options: any = {
    secure: true,
  }

  if (width) options.width = width
  if (height) options.height = height
  if (crop) options.crop = crop

  return cloudinary.url(publicId, options)
}

// Get thumbnail URL
export const getThumbnailUrl = (
  publicId: string,
  size: number = 150
): string => {
  return getImageUrl(publicId, size, size, 'fill')
}

// Get optimized image URL
export const getOptimizedUrl = (
  publicId: string,
  width?: number,
  height?: number
): string => {
  return getImageUrl(publicId, width, height, 'scale')
}

// Delete single image
export const deleteImage = async (
  imageUrl: string
): Promise<DeleteResult | null> => {
  try {
    const publicId = extractPublicId(imageUrl)
    console.log('publicId', publicId)
    if (!publicId) {
      console.log('Invalid image URL:', imageUrl)
      return null
    }
    const result = await cloudinary.uploader.destroy(publicId)
    return result as DeleteResult
  } catch (error: any) {
    console.error('Failed to delete image:', error.message)
    return null
  }
}

// Delete multiple images
export const deleteMultipleImages = async (
  publicIds: string[]
): Promise<DeleteResult> => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds)
    return result as DeleteResult
  } catch (error: any) {
    throw new CloudinaryError(error.message || 'Failed to delete images')
  }
}

// Delete all images in a folder
export const deleteFolderImages = async (
  folder: string
): Promise<DeleteResult> => {
  try {
    const result = await cloudinary.api.delete_resources_by_prefix(folder)
    return result as DeleteResult
  } catch (error: any) {
    throw new CloudinaryError(error.message || 'Failed to delete folder images')
  }
}

// Delete user's images
export const deleteUserImages = async (
  userId: string
): Promise<DeleteResult> => {
  try {
    const result = await cloudinary.api.delete_resources_by_tag(userId)
    return result as DeleteResult
  } catch (error: any) {
    throw new CloudinaryError(error.message || 'Failed to delete user images')
  }
}

// Extract public ID from Cloudinary URL
export const extractPublicId = (url: string): string | null => {
  const matches = url.match(/\/v\d+\/(.+)\./)
  return matches ? matches[1] : null
}

// Validate if URL is a valid Cloudinary URL
export const isValidCloudinaryUrl = (url: string): boolean => {
  return url.includes('cloudinary.com') && extractPublicId(url) !== null
}

// Get image info
export const getImageInfo = async (publicId: string) => {
  try {
    const result = await cloudinary.api.resource(publicId)
    return result
  } catch (error: any) {
    throw new CloudinaryError(error.message || 'Failed to get image info')
  }
}

export default cloudinary
