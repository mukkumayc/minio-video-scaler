import minio from "minio";
import uploadHandler from "./uploadHandler";

export function startUploadListener() {
	const accessKey = process.env["ACCESS_KEY"];
	const secretKey = process.env["SECRET_KEY"];

	if (!accessKey || !secretKey) {
		console.log(process.env);
		throw new Error("Access keys not provided");
	}

	const client = new minio.Client({
		endPoint: "localhost",
		port: 9000,
		accessKey,
		secretKey,
		useSSL: false,
	});

	const poller = client.listenBucketNotification("uploaded-videos", "", "", [
		"s3:ObjectCreated:*",
	]);

	poller.on("notification", uploadHandler(client));
}

startUploadListener();
