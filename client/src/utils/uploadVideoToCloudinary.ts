import { handleApiError } from "./apiError";

export async function uploadVideoToCloudinary({
  file,
  signatureData,
}: {
  file: File;
  signatureData: {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
  };
}) {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", String(signatureData.timestamp));
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/video/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error("Video upload failed");
    }

    return res.json();
  } catch (error) {
    // throw new Error(handleApiError(error));
    throw error;
  }
}
