import type { Client } from "minio";
import type NotificationRecord from "./NotificationRecord";
import { cutParentDir } from "./utils";
import videoScaler from "./videoScaler";
import fs from "fs/promises";

const uploadHandler =
	(client: Client) => async (record: NotificationRecord) => {
		const bucketName = record.s3.bucket.name;
		const objectPath = record.s3.object.key;

		const videoPath = `uploads/${objectPath}`;

		await client.fGetObject(bucketName, objectPath, videoPath);

		console.log(new Date(), "Get upload! File:", `${bucketName}/${objectPath}`);

		const resolutions = [240, 360, 480, 720, 1080] as const;
		const processedVideoPaths = await Promise.all(
			resolutions.map(videoScaler(videoPath))
		);

		await Promise.all(
			processedVideoPaths.map((path) =>
				client.fPutObject("processed-videos", cutParentDir(path), path, {
					"Content-Type": "video/mp4",
				})
			)
		);

		return fs.rm("uploads", { recursive: true, force: true });
	};

export default uploadHandler;
