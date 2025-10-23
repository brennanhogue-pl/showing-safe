import { supabase } from "@/lib/supabase";

export async function uploadClaimFiles(
  files: FileList | File[],
  userId: string,
  bucketName: string = 'claim-photos'
): Promise<string[]> {
  // Convert FileList to array if needed
  const fileArray = Array.from(files);

  const uploadPromises = fileArray.map(async (file, index) => {
    // Create a unique filename using userId, timestamp, and original filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}-${index}.${fileExt}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrl;
  });

  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    throw error;
  }
}
