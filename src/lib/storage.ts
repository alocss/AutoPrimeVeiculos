import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

/**
 * Saves an uploaded file and returns its public URL.
 *
 * Vercel's serverless functions run on a read-only filesystem, so writing to
 * `public/uploads` there silently never gets served. When a Blob store is
 * connected (`BLOB_READ_WRITE_TOKEN` set — Vercel injects this automatically
 * once you add a Blob store to the project), files go there instead. Local
 * dev and Docker/VPS deployments (which mount a persistent volume over
 * `public/uploads`, see docker-compose.yml) keep writing straight to disk.
 */
export async function saveUploadedFile(file: File, folder: string, filename: string): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${folder}/${filename}`;
}
