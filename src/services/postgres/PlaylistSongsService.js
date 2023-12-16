const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')

class PlaylistSongsService {
  constructor (
    collaborationService,
    songsService,
    playlistsService,
    playlistSongActivitiesService
  ) {
    this._pool = new Pool()
    this._collaborationService = collaborationService
    this._songsService = songsService
    this._playlistsService = playlistsService
    this._playlistSongActivitiesService = playlistSongActivitiesService
  }

  async addPlaylistSong (credentialId, playlistId, songId) {
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    await this._songsService.verifySongExist(songId)

    const id = `pSong-${nanoid(16)}`
    const action = 'add'

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Failed to add the song to the playlist')
    }

    this._playlistSongActivitiesService.addPlaylistSongActivity(
      playlistId,
      songId,
      credentialId,
      action
    )

    return result.rows[0].id
  }

  async getPlaylistSongs (credentialId, playlistId) {
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const query = {
      text: `SELECT playlists.id AS playlist_id, playlists.name AS playlist_name, users.username AS username,
            playlist_songs.id AS song_id, songs.title AS song_title, songs.performer AS song_performer
            FROM playlists
            LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
            LEFT JOIN songs ON playlist_songs.song_id = songs.id
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.id = $1`,
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    return result.rows
  }

  async deletePlaylistSong (credentialId, playlistId, songId) {
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const action = 'delete'
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist')
    }

    await this._playlistSongActivitiesService.addPlaylistSongActivity(
      playlistId,
      songId,
      credentialId,
      action
    )
  }
}

module.exports = PlaylistSongsService
