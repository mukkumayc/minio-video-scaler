import * as minio from 'minio'

import uploadHandler from './uploadHandler'

export function startUploadListener() {
	const accessKey = process.env['MINIO_ACCESS_KEY']
	const secretKey = process.env['MINIO_SECRET_KEY']
	const bucketToListen = process.env['BUCKET_TO_UPLOAD']
	const bucketToTransform = process.env['BUCKET_TO_TRANSFORM']
	const port = process.env['PORT'] || '9090'

	if (!accessKey || !secretKey) {
		console.log(process.env)
		throw new Error('Access keys is not provided')
	}

	if (!bucketToListen || !bucketToTransform) {
		throw new Error('Buckets is not provided')
	}

	const client = new minio.Client({
		endPoint: 'localhost',
		port: parseInt(port),
		accessKey,
		secretKey,
		useSSL: false
	})

	const poller = client.listenBucketNotification(bucketToListen, '', '', [
		's3:ObjectCreated:*'
	])

	poller.on('notification', uploadHandler(client, bucketToTransform))
}

startUploadListener()
