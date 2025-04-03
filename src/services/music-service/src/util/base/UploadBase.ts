import { cloudinaryInstance } from '../../config/cloudinary/CloudinaryConfig.js';
import { PassThrough } from 'stream';

class UploadBase {
    uploadFile = async (
        file: { originalName: string; buffer: Buffer },
        musicId: string
    ): Promise<{ storage: string; url: string }> => {
        try {
            console.log("Uploading file to Cloudinary...");
            const cloudinaryUrl = await this.uploadToCloudinary(file, musicId);
            console.log("File uploaded to Cloudinary:", cloudinaryUrl);
            return { storage: "cloudinary", url: cloudinaryUrl };
        } catch (error) {
            console.error("Cloudinary upload failed:", error);
            throw new Error(`Upload failed: ${error.message}`);
        }
    };

    uploadToCloudinary = async (file: { originalName: string; buffer: Buffer }, musicId: string): Promise<string> => {
        return new Promise((resolve, reject) => {

            const sanitizedFileName = file.originalName
                .replace(/\.[^/.]+$/, "")
                .replace(/[^a-zA-Z0-9_-]/g, "")
                .toLowerCase();

            const uploadStream = cloudinaryInstance.uploader.upload_stream(
                {
                    folder: `music-storage/files/${musicId}`,
                    public_id: sanitizedFileName,
                    resource_type: "auto"
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result.secure_url);
                }
            );

            const bufferStream = new PassThrough();
            bufferStream.end(file.buffer);
            bufferStream.pipe(uploadStream);
        });
    };

    getSignedFileUrl = async (fileInfo: { storage: string; url?: string }) => {
        if (fileInfo.storage === "cloudinary" && fileInfo.url) {
            console.log("File is stored on Cloudinary, returning direct URL.");
            return fileInfo.url;
        }

        console.error("Invalid file info provided.");
        return null;
    };

    async uploadAndGetUrl(file: any, id: string) {
        const uploadData = await this.uploadFile(file, id);
        return await this.getSignedFileUrl(uploadData);
    }
    async  deleteFolder(musicId: string) {
        const folderPath = `music-storage/files/${musicId}`;

        const fileTypes = ["image", "video", "raw"];
        let resourcesByType: { [key: string]: string[] } = { image: [], video: [], raw: [] };

        for (const type of fileTypes) {
            const resources = await cloudinaryInstance.api.resources({
                type: "upload",
                prefix: folderPath,
                resource_type: type,
                max_results: 500,
            });

            resourcesByType[type] = resources.resources.map((file: any) => file.public_id);
        }

        for (const type of fileTypes) {
            if (resourcesByType[type].length > 0) {
                await cloudinaryInstance.api.delete_resources(resourcesByType[type], { resource_type: type });
            }
        }

        await cloudinaryInstance.api.delete_folder(folderPath);
    }
}

export default new UploadBase();

