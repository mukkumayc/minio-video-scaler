export default interface NotificationRecord {
	eventVersion: string
	eventSource: string
	awsRegion: string
	eventTime: string
	eventName: string
	userIdentity: { principalId: string }
	requestParameters: {
		principalId: string
		region: string
		sourceIPAddress: string
	}
	responseElements: {
		'content-length': string
		'x-amz-request-id': string
		'x-minio-deployment-id': string
		'x-minio-origin-endpoint': string
	}
	s3: {
		s3SchemaVersion: string
		configurationId: string
		bucket: {
			name: string
			ownerIdentity: unknown
			arn: string
		}
		object: {
			key: string
			size: number
			eTag: string
			contentType: string
			userMetadata: unknown
			sequencer: string
		}
	}
	source: {
		host: string
		port: string
		userAgent: string
	}
}
