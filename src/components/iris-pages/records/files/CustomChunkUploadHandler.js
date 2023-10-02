import FileUpload from 'vue-upload-component'
import SparkMD5 from 'spark-md5'
import { asyncFileReader, dataURLtoBlob } from '~/assets/js/utils'
import { default as request, createRequest, sendFormRequest } from './request'

const ChunkUploadHandler = FileUpload.props.chunk.default().handler

export default class CustomChunkUploadHandler extends ChunkUploadHandler {
  /**
   * Start phase
   * Sends a request to the backend to initialise the chunks
   *
   * (Adapted to start the chunking right away)
   */
  async start() {
    this.chunkSize = this.options.chunkSize
    try {
      await this.createChunks()
      this.startChunking()
    } catch (error) {
      this.stopChunks()
      return this.reject('chunk')
    }
  }

  /**
   * Creates all the chunks in the initial state
   *
   * (Adapted to upload base64 encoded files)
   * (ADDS: base64BlobMd5, totalBytes)
   */
  async createChunks() {
    this.chunks = []

    try {
      const base64String = await asyncFileReader(
        this.file.file,
        'readAsDataURL'
      )
      const base64Blob = await dataURLtoBlob(base64String)

      this.totalBytes = base64Blob.size
      this.base64BlobMd5 = SparkMD5.ArrayBuffer.hash(
        await asyncFileReader(base64Blob, 'readAsArrayBuffer')
      )

      let start = 0
      let end = this.chunkSize
      let total = Math.ceil(this.totalBytes / this.chunkSize)
      while (start < this.totalBytes) {
        this.chunks.push({
          blob: base64Blob.slice(start, end),
          startOffset: start,
          active: false,
          retries: this.maxRetries,
          chunks: total,
        })
        start = end
        end = start + this.chunkSize
      }
      return true
    } catch (error) {
      return error
    }
  }

  /**
   * Uploads a chunk
   * - Sends the chunk to the backend
   * - Sets the chunk as uploaded if everything went well
   * - Decreases the number of retries if anything went wrong
   * - Fails if there are no more retries
   *
   * @param {Object} chunk
   *
   * (Adapted to customize the request depending on whether
   * we're on the first put or subsequent ones)
   * (ADDS: nextChunkId, nextOffset)
   */
  uploadChunk(chunk) {
    chunk.progress = 0
    chunk.active = true
    this.updateFileProgress()

    // Post params, request header and url needs to be customized
    let url = ''
    let contentRange = ''
    let params = {}

    // If this.options.maxActive is set to 1, this.chunksUploaded indicates the chunk we're on
    if (this.chunksUploaded.length === 0) {
      url = this.action
      contentRange = `bytes ${0}-${chunk.blob.size - 1}/${this.totalBytes}` // chunk.startOffse

      params = {
        ...this.startBody,
        filename: this.fileName,
        file: chunk.blob,
        total: chunk.chunks,
      }
    } else {
      url = this.nextUploadUrl
      contentRange = `bytes ${this.nextOffset}-${this.nextOffset +
        chunk.blob.size -
        1}/${this.totalBytes}`

      params = {
        ...this.uploadBody,
        file: chunk.blob,
        total: chunk.chunks,
      }
    }

    chunk.xhr = createRequest({
      method: 'PUT',
      headers: { ...this.headers, ...{ 'Content-Range': contentRange } },
      url: url,
    })

    chunk.xhr.upload.addEventListener(
      'progress',
      function(evt) {
        if (evt.lengthComputable) {
          chunk.progress = Math.round((evt.loaded / evt.total) * 100)
        }
      },
      false
    )

    // Used for both the initial and chunk uploads
    sendFormRequest(chunk.xhr, { ...params })
      .then(res => {
        chunk.active = false
        if (res.status) {
          this.nextChunkId = res.id
          this.nextOffset = res.offset
          this.nextUploadUrl = res.url
          chunk.uploaded = true
          if (this.chunks.length == 1) {
            this.file.response = res
          }
        } else {
          if (chunk.retries-- <= 0) {
            this.file.response = res
            this.stopChunks()
            return this.reject('upload')
          }
        }

        this.uploadNextChunk()
      })
      .catch(error => {
        chunk.active = false
        if (chunk.retries-- <= 0) {
          this.stopChunks()
          return this.reject({ type: 'upload', content: error })
        }

        this.uploadNextChunk()
      })
  }

  /**
   * Finish phase
   * Sends a request to the backend to finish the process
   *
   * (Adapted to customize the request)
   */
  finish() {
    this.updateFileProgress()
    if (this.chunks.length <= 1) {
      this.resolve()
      return
    }
    const xhr = createRequest({
      method: 'POST',
      headers: {
        ...this.headers,
      },
      url: this.nextUploadUrl,
    })

    const params = {
      md5: this.base64BlobMd5,
    }

    sendFormRequest(xhr, { ...this.finishBody, ...params })
      .then(res => {
        this.file.response = res
        if (!res.status) {
          return this.reject('server')
        }

        this.resolve(res)
      })
      .catch(res => {
        this.file.response = res
        this.reject({ type: 'server', content: res })
      })
  }
}
