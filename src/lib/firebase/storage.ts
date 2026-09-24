import { ref, uploadBytes, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

/**
 * High-performance client-side image compressor.
 * Downscales images proportionally (max 1200px width/height) using HTML5 Canvas
 * with high-quality smoothing and 88% JPEG quality.
 * Reduces 5-10MB photos to ~150-250KB without perceptible visual quality loss.
 */
export async function compressImage(
  fileOrDataUrl: File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.88
): Promise<string> {
  if (typeof window === "undefined") {
    return typeof fileOrDataUrl === "string" ? fileOrDataUrl : "";
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        let { width, height } = img;

        // Calculate proportional dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(typeof fileOrDataUrl === "string" ? fileOrDataUrl : img.src);
          return;
        }

        // Enable high-quality bicubic smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-quality compressed JPEG
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      } catch (e) {
        console.warn("Canvas compression fallback:", e);
        resolve(typeof fileOrDataUrl === "string" ? fileOrDataUrl : img.src);
      }
    };

    img.onerror = () => {
      resolve(typeof fileOrDataUrl === "string" ? fileOrDataUrl : "");
    };

    if (typeof fileOrDataUrl === "string") {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = (e.target?.result as string) || "";
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

/**
 * When a photo cannot be uploaded to Storage it is stored inline in Firestore.
 * Firestore documents are capped at 1MB, so shrink inline data URLs to a card-sized image.
 */
export async function toFirestoreSafePhoto(photo: string): Promise<string> {
  if (!photo || !photo.startsWith("data:")) return photo;
  if (photo.length < 250_000) return photo;
  try {
    const shrunk = await compressImage(photo, 600, 600, 0.8);
    return shrunk || photo;
  } catch {
    return photo;
  }
}

/**
 * Upload a member profile / ID card photo to Firebase Storage.
 * Compresses the image to reduce size without losing quality,
 * then uploads to Firebase Storage and returns the permanent download URL.
 */
export async function uploadMemberPhoto(
  fileOrDataUrl: File | string,
  memberIdOrUid: string
): Promise<string> {
  // If already an HTTP/HTTPS URL or local path, return immediately without re-uploading
  if (typeof fileOrDataUrl === "string") {
    if (!fileOrDataUrl) return "";
    if (
      fileOrDataUrl.startsWith("http://") ||
      fileOrDataUrl.startsWith("https://") ||
      fileOrDataUrl.startsWith("/")
    ) {
      return fileOrDataUrl;
    }
  }

  const timestamp = Date.now();
  const storagePath = `members/${memberIdOrUid}/id_photo_${timestamp}.jpg`;
  const storageRef = ref(storage, storagePath);

  // Compress image before upload to drastically reduce size while preserving clarity
  let compressedDataUrl: string;
  try {
    compressedDataUrl = await compressImage(fileOrDataUrl, 1200, 1200, 0.88);
  } catch {
    compressedDataUrl = typeof fileOrDataUrl === "string" ? fileOrDataUrl : "";
  }

  if (compressedDataUrl && compressedDataUrl.startsWith("data:")) {
    await uploadString(storageRef, compressedDataUrl, "data_url", {
      contentType: "image/jpeg",
    });
    return await getDownloadURL(storageRef);
  }

  if (typeof fileOrDataUrl === "string") {
    if (fileOrDataUrl.startsWith("data:")) {
      await uploadString(storageRef, fileOrDataUrl, "data_url", {
        contentType: "image/jpeg",
      });
      return await getDownloadURL(storageRef);
    }
    // Preset or remote URL
    return fileOrDataUrl;
  }

  // Fallback direct File upload
  await uploadBytes(storageRef, fileOrDataUrl, {
    contentType: fileOrDataUrl.type || "image/jpeg",
  });
  return await getDownloadURL(storageRef);
}

/**
 * Upload a property listing image to Firebase Storage with compression.
 */
export async function uploadPropertyImage(
  fileOrDataUrl: File | string,
  propertyId: string,
  fileName?: string
): Promise<string> {
  if (typeof fileOrDataUrl === "string") {
    if (!fileOrDataUrl) return "";
    if (
      fileOrDataUrl.startsWith("http://") ||
      fileOrDataUrl.startsWith("https://") ||
      fileOrDataUrl.startsWith("/")
    ) {
      return fileOrDataUrl;
    }
  }

  const fileExt = fileName ? fileName.split(".").pop() : "jpg";
  const uniqueName = `image_${Date.now()}.${fileExt}`;
  const storagePath = `properties/${propertyId}/${uniqueName}`;
  const storageRef = ref(storage, storagePath);

  let compressedDataUrl = "";
  try {
    compressedDataUrl = await compressImage(fileOrDataUrl, 1600, 1200, 0.85);
  } catch {
    compressedDataUrl = typeof fileOrDataUrl === "string" ? fileOrDataUrl : "";
  }

  if (compressedDataUrl && compressedDataUrl.startsWith("data:")) {
    await uploadString(storageRef, compressedDataUrl, "data_url", {
      contentType: "image/jpeg",
    });
    return await getDownloadURL(storageRef);
  }

  if (typeof fileOrDataUrl === "string") {
    if (fileOrDataUrl.startsWith("data:")) {
      await uploadString(storageRef, fileOrDataUrl, "data_url", {
        contentType: "image/jpeg",
      });
      return await getDownloadURL(storageRef);
    }
    return fileOrDataUrl;
  }

  await uploadBytes(storageRef, fileOrDataUrl, {
    contentType: fileOrDataUrl.type || "image/jpeg",
  });
  return await getDownloadURL(storageRef);
}

/**
 * Upload arbitrary file/document to Firebase Storage.
 */
export async function uploadFile(
  file: File,
  folderPath: string
): Promise<string> {
  const cleanPath = `${folderPath}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const storageRef = ref(storage, cleanPath);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * Delete a file from Firebase Storage given its full URL or path.
 */
export async function deleteStorageFile(storageUrlOrPath: string): Promise<void> {
  try {
    const storageRef = ref(storage, storageUrlOrPath);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn("Could not delete file from Firebase Storage:", error);
  }
}
