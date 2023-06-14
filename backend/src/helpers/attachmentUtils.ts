import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'


const XAWS = AWSXRay.captureAWS(AWS)
const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
// TODO: Implement the fileStogare logic
export class AttachmentUtils {
  getPutSignedUrl(attachmentId : string): string {
    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: attachmentId,
      Expires: parseInt(urlExpiration)
    })
    
    return uploadUrl
  }
}
