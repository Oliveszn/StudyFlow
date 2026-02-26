import { handleApiError } from "./apiError";

// export async function uploadVideoToCloudinary({
//   file,
//   signatureData,

// }: {
//   file: File;
//   signatureData: {
//     cloudName: string;
//     apiKey: string;
//     timestamp: number;
//     signature: string;
//     folder: string;
//   };
// }) {
//   try {
//     const formData = new FormData();

//     formData.append("file", file);
//     formData.append("api_key", signatureData.apiKey);
//     formData.append("timestamp", String(signatureData.timestamp));
//     formData.append("signature", signatureData.signature);
//     formData.append("folder", signatureData.folder);
//     // formData.append("resource_type", "video");

//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/video/upload`,
//       {
//         method: "POST",
//         body: formData,
//       },
//     );

//     if (!res.ok) {
//       throw new Error("Video upload failed");
//     }

//     return res.json();
//   } catch (error) {
//     // throw new Error(handleApiError(error));
//     throw error;
//   }
// }

////USING XMLHTTP REQUESTS COS FETCH DOESN'T SUPPRT PROGRESS TRACKING
export async function uploadVideoToCloudinary({
  file,
  signatureData,
  onProgress,
}: {
  file: File;
  signatureData: {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
  };
  onProgress?: (percent: number) => void;
}) {
  return new Promise<{
    secure_url: string;
    public_id: string;
    duration: number;
  }>((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", String(signatureData.timestamp));
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress?.(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload failed")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/video/upload`,
    );
    xhr.send(formData);
  });
}
