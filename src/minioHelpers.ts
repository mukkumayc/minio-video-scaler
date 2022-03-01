import type { Client } from "minio";
import fs from "fs/promises";
import path from "path";

export const fileDownloader =
	(client: Client) =>
	async (bucketName: string, objectPath: string, downloadPath: string) => {
		console.log("Downloading file", `${bucketName}/${objectPath}`);

		const res = await client.getObject(bucketName, objectPath);
		await fs.mkdir(path.dirname(downloadPath), { recursive: true });
		await fs.writeFile(downloadPath, res);

		console.log("Download completed.", `File is located at ${downloadPath}`);
		return downloadPath;
	};

export const fileUploader =
	(client: Client) =>
	(bucketName: string) =>
	(filePath: string, uploadPath: string) => {
		return new Promise(async (resolve, reject) => {
			client.putObject(
				bucketName,
				uploadPath,
				await fs.readFile(filePath),
				(err) => {
					console.log(`File ${bucketName}/${filePath} has been uploaded`);
					return err ? reject(err) : resolve(null);
				}
			);
		});
	};
