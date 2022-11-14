import * as minio from 'minio'

import uploadHandler from './uploadHandler'

export function startUploadListener() {
	const accessKey = process.env['MINIO_ROOT_USER']
	const secretKey = process.env['MINIO_ROOT_PASSWORD']
	const bucketToListen = process.env['VIDEOS_TO_TRANSFORM_BUCKET']
	const bucketToTransform = process.env['PUBLIC_BUCKET']
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
