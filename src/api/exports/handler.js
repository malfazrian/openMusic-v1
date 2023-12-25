const autoBind = require('auto-bind')

class ExportsHandler {
  constructor (service, validator, playlistsService) {
    this._service = service
    this._validator = validator
    this._playlistsService = playlistsService

    autoBind(this)
  }

  async postExportPlaylistsHandler (request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload)
    await this._playlistsService.verifyPlaylistExist(request.params.playlistId)
    await this._playlistsService.verifyPlaylistOwner(
      request.params.playlistId,
      request.auth.credentials.id
    )

    const message = {
      userId: request.auth.credentials.id,
      playlistId: request.params.playlistId,
      targetEmail: request.payload.targetEmail
    }

    await this._service.sendMessage(
      'export:playlists',
      JSON.stringify(message)
    )

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses'
    })
    response.code(201)
    return response
  }
}

module.exports = ExportsHandler
