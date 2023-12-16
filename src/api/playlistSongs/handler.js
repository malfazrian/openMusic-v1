const autoBind = require('auto-bind')
const mapDBtoModel = require('../../util/index').mapDBtoModel

class PlaylistSongsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postPlaylistSongHandler (request, h) {
    this._validator.validatePlaylistSongPayload(request.payload)

    const { id: credentialId } = request.auth.credentials
    const { id: playlistId } = request.params
    const { songId } = request.payload

    const playlistSongsId = await this._service.addPlaylistSong(
      credentialId,
      playlistId,
      songId
    )

    const response = h.response({
      status: 'success',
      message: 'Lagu playlist berhasil ditambahkan',
      data: {
        playlistSongsId
      }
    })
    response.code(201)
    return response
  }

  async getPlaylistSongsHandler (request) {
    const { id: credentialId } = request.auth.credentials
    const { id: playlistId } = request.params
    const playlistSongs = await this._service.getPlaylistSongs(
      credentialId,
      playlistId
    )

    const playlist = mapDBtoModel(playlistSongs)

    return {
      status: 'success',
      data: {
        playlist
      }
    }
  }

  async deletePlaylistSongByIdHandler (request) {
    const { id: credentialId } = request.auth.credentials
    const { id: playlistId } = request.params
    const { songId } = request.payload

    await this._service.deletePlaylistSong(credentialId, playlistId, songId)

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }
}

module.exports = PlaylistSongsHandler
