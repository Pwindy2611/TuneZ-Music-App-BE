import {supabase} from '../../config/supabase/SupabaseConfig.js'
import {cloudinary} from '../../config/cloudinary/CloudinaryConfig.js'

export const uploadFile = async (
    file: { originalName: string; mimetype: string; buffer: Buffer },
    musicId: string
) => {
    const supabasePath = `files/${musicId}/${file.originalName}`

    // Thử upload lên Supabase
    const { data, error } = await supabase.storage
        .from("music-storage")
        .upload(supabasePath, file.buffer, { contentType: file.mimetype })

    if (!error) {
        console.log("File uploaded to Supabase:", data)
        return { storage: "supabase", path: supabasePath }
    }

    console.error("Supabase upload error:", error)

    // Kiểm tra dung lượng lưu trữ
    try {
        const storageUsage = await getSupabaseStorageUsage()

        if (storageUsage >= 1073741824) { // 1GB
            const cloudinaryUrl = await uploadToCloudinary(file, musicId)
            return { storage: "cloudinary", url: cloudinaryUrl }
        } else {
            return Promise.reject(new Error(`Upload failed but storage not full: ${error.message}`))
        }
    } catch (err) {
        console.error("Storage check failed:", err)
        throw err
    }
}

export const uploadToCloudinary = async (file: { originalName: string; buffer: Buffer }, musicId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `music-storage/files/${musicId}`,
                public_id: file.originalName.replace(/\.[^/.]+$/, ""), // Bỏ extension
                resource_type: "auto"
            },
            (error, result) => {
                if (error || !result) return reject(error)
                resolve(result.secure_url)
            }
        )

        const bufferStream = new (require('stream').PassThrough)()
        bufferStream.end(file.buffer)
        bufferStream.pipe(uploadStream)
    })
}
export const getSignedFileUrl = async (filePath: string) => {
    const oneYearInSeconds = 31536000;
    const { data, error } = await supabase.storage
        .from("music-storage")
        .createSignedUrl(filePath, oneYearInSeconds);

    if (error) {
        console.error("Error generating signed URL:", error.message);
        return null;
    }

    console.log("Signed URL:", data.signedUrl);
    return data.signedUrl;
};

const getSupabaseStorageUsage = async (): Promise<number> => {
    const calculateFolderSize = async (path: string): Promise<number> => {
        let totalSize = 0
        let page = 0
        const limit = 1000

        while (true) {
            const { data: items, error } = await supabase.storage
                .from("music-storage")
                .list(path, { limit, offset: page * limit })

            if (error) throw error
            if (!items.length) break

            for (const item of items) {
                if (item.metadata) {
                    totalSize += item.metadata.size
                } else {
                    totalSize += await calculateFolderSize(`${path}/${item.name}`)
                }
            }
            page++
        }
        return totalSize
    }

    return await calculateFolderSize("files")
}