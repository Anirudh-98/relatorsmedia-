import { ref, uploadBytes, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

/**
 * Upload a member profile / ID card photo to Firebase Storage.
 * Accepts either a File object from input[type=file] or a Base64 data URL from camera capture.
 */
export async function uploadMemberPhoto(
  fileOrDataUrl: File | string,
  memberIdOrUid: string
): Promise<string> {
  const timestamp = Date.now();
  const storagePath = `members/${memberIdOrUid}/id_photo_${timestamp}.jpg`;
  const storageRef = ref(storage, storagePath);

  if (typeof fileOrDataUrl === "string") {
    // Check if it is a data URL (e.g., from camera canvas)
    if (fileOrDataUrl.startsWith("data:")) {
      await uploadString(storageRef, fileOrDataUrl, "data_url", {
        contentType: "image/jpeg",
      });
    } else {
      // If it's already an external HTTP URL, return as-is
      return fileOrDataUrl;
    }
  } else {
    // It's a browser File object
    await uploadBytes(storageRef, fileOrDataUrl, {
      contentType: fileOrDataUrl.type || "image/jpeg",
    });
  }

  // Get download URL from Firebase Storage
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

/**
 * Upload a property listing image to Firebase Storage.
 */
export async function uploadPropertyImage(
  fileOrDataUrl: File | string,
  propertyId: string,
  fileName?: string
): Promise<string> {
  const fileExt = fileName ? fileName.split(".").pop() : "jpg";
  const uniqueName = `image_${Date.now()}.${fileExt}`;
  const storagePath = `properties/${propertyId}/${uniqueName}`;
  const storageRef = ref(storage, storagePath);

  if (typeof fileOrDataUrl === "string") {
    if (fileOrDataUrl.startsWith("data:")) {
      await uploadString(storageRef, fileOrDataUrl, "data_url", {
        contentType: "image/jpeg",
      });
    } else {
      return fileOrDataUrl;
    }
  } else {
    await uploadBytes(storageRef, fileOrDataUrl, {
      contentType: fileOrDataUrl.type || "image/jpeg",
    });
  }

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
