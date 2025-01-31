import {supabase} from '../../config/supabase/SupabaseConfig.js'

export const uploadFile = async (file: { originalName: string; mimetype: string; buffer: Buffer }, musicId: String) => {
    const { data, error } = await supabase.storage
        .from("music-storage")
        .upload(`files/${musicId}/${file.originalName}`, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) console.error(error);
    else console.log("File uploaded:", data);
    return data;
};

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
