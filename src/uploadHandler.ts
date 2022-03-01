import type { Client } from "minio";
import { fileDownloader, fileUploader } from "./minioHelpers";
import type NotificationRecord from "./NotificationRecord";
import { cutParentDir } from "./utils";
import videoScaler from "./videoScaler";

const uploadHandler =
	(client: Client) => async (record: NotificationRecord) => {
		const bucketName = record.s3.bucket.name;
		const objectPath = record.s3.object.key;

		const videoPath = await fileDownloader(client)(
			bucketName,
			objectPath,
			`uploads/${objectPath}`
		);
		console.log(new Date(), "Get upload! File:", `${bucketName}/${objectPath}`);

		const resolutions = [240, 360, 480, 720, 1080] as const;
		Promise.all(resolutions.map(videoScaler(videoPath))).then((path) =>
			path.map((path) =>
				fileUploader(client)("processed-videos")(path, cutParentDir(path))
			)
		);
	};

export default uploadHandler;
