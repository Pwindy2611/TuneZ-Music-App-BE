import {supabase} from '../../config/supabase/SupabaseConfig.js'
import {cloudinary} from '../../config/cloudinary/CloudinaryConfig.js'
import { PassThrough } from 'stream';

export const uploadFile = async (
    file: { originalName: string; mimetype: string; buffer: Buffer },
    musicId: string
) => {
    try {
        const storageUsage = await getSupabaseStorageUsage();
        console.log("Supabase Storage Usage:", storageUsage);

        if (storageUsage >= 1073741824) { // Nếu đã đầy 1GB, upload lên Cloudinary
            console.log("Supabase full, uploading to Cloudinary...");
            const cloudinaryUrl = await uploadToCloudinary(file, musicId);
            return { storage: "cloudinary", url: cloudinaryUrl };
        }

        // Nếu còn dung lượng, thử upload Supabase
        console.log("Uploading to Supabase...");
        const supabasePath = `files/${musicId}/${file.originalName}`;
        const { data, error } = await supabase.storage
            .from("music-storage")
            .upload(supabasePath, file.buffer, { contentType: file.mimetype });

        if (!error) {
            console.log("File uploaded to Supabase:", data);
            return { storage: "supabase", path: supabasePath };
        }

        console.error("Supabase upload error:", error);
        return Promise.reject(new Error(`Upload failed: ${error.message}`));
    } catch (err) {
        console.error("Storage check failed:", err);
        throw err;
    }
};

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

        const bufferStream = new PassThrough();
        bufferStream.end(file.buffer)
        bufferStream.pipe(uploadStream)
    })
}
export const getSignedFileUrl = async (fileInfo: { storage: string, path?: string, url?: string }) => {
    if (fileInfo.storage === "cloudinary") {
        console.log("File is stored on Cloudinary, returning direct URL.");
        return fileInfo.url; // Cloudinary đã có URL trực tiếp, không cần signed URL
    }

    if (fileInfo.storage === "supabase" && fileInfo.path) {
        const oneYearInSeconds = 31536000;
        const { data, error } = await supabase.storage
            .from("music-storage")
            .createSignedUrl(fileInfo.path, oneYearInSeconds);

        if (error) {
            console.error("Error generating signed URL from Supabase:", error.message);
            return null;
        }

        console.log("Signed URL from Supabase:", data.signedUrl);
        return data.signedUrl;
    }

    console.error("Invalid file info provided.");
    return null;
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