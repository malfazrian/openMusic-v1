const autoBind = require('auto-bind')
const PayloadTooLargeError = require('../../exceptions/PayloadTooLargeError')

class AlbumsHandler {
  constructor (service, validator, coverValidator) {
    this._service = service
    this._validator = validator
    this._coverValidator = coverValidator

    autoBind(this)
  }

  async postAlbumsHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { name, year } = request.payload
    const coverUrl = null

    const albumId = await this._service.addAlbum({ name, year, coverUrl })

    const response = h.response({
      status: 'success',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async postAlbumCoverHandler (request, h) {
    const { cover } = request.payload
    const { albumId } = request.params
    await this._coverValidator.validateImageHeaders(cover.hapi.headers)

    const fileSize = cover._data.length
    if (fileSize > 512000) {
      throw new PayloadTooLargeError(
        'Upload cover album gagal. Size gambar melebihi 512 kb'
      )
    }

    const filename = await this._service.writeFile(cover, cover.hapi)
    const sanitizeFilename = filename.replace(/ /g, '%20')

    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/api/albums/file/images/${sanitizeFilename}`

    await this._service.addCoverAlbum(albumId, fileLocation)

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    })
    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request) {
    const { id } = request.params
    const album = await this._service.getAlbumById(id)
    return {
      status: 'success',
      data: {
        album
      }
    }
  }

  async putAlbumByIdHandler (request) {
    this._validator.validateAlbumPayload(request.payload)
    const { name, year } = request.payload
    const { id } = request.params

    await this._service.editAlbumById(id, { name, year })

    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  async deleteAlbumByIdHandler (request) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)

    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }
}

module.exports = AlbumsHandler
