import { mkdtempSync } from 'fs'
import * as fs from 'fs/promises'
import type { Client } from 'minio'
import { tmpdir } from 'os'
import path from 'path'

import type NotificationRecord from './NotificationRecord'
import videoScaler from './videoScaler'

const tempDir = mkdtempSync(path.join(tmpdir(), 'minio-video-scaler'))

const uploadHandler =
	(client: Client, bucketToTransform: string) =>
	async (record: NotificationRecord) => {
		const bucketName = record.s3.bucket.name
		const objectPath = record.s3.object.key

		const videoPath = `${tempDir}/uploads/${objectPath}`

		await client.fGetObject(bucketName, objectPath, videoPath)

		console.log(new Date(), 'Get upload! File:', `${bucketName}/${objectPath}`)

		const resolutions = [240, 360, 480, 720, 1080] as const

		const uploads = []
		for (const resolution of resolutions) {
			const processedVideo = await videoScaler(videoPath)(resolution)

			uploads.push(
				client.fPutObject(
					bucketToTransform,
					`${path.dirname(objectPath)}/${path.basename(processedVideo)}`,
					processedVideo,
					{
						'Content-Type': 'video/mp4'
					}
				)
			)
		}

		await Promise.all(uploads)

		return fs.rm(`${tempDir}/uploads`, { recursive: true, force: true })
	}

export default uploadHandler
