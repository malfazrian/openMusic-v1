const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')

class PlaylistSongActivitiesService {
  constructor (playlistsService) {
    this._pool = new Pool()
    this._playlistsService = playlistsService
  }

  async addPlaylistSongActivity (playlistId, songId, userId, action) {
    const id = `activities-${nanoid(16)}`
    const time = new Date().toISOString()

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Aktivitas playlist lagu gagal ditambahkan')
    }
  }

  async getPlaylistSongActivities (credentialId, id) {
    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    await this._playlistsService.verifyPlaylistExist(id)

    const query = {
      text: `SELECT
              u.username AS username,
              s.title AS title,
              psa.action,
              psa.time
            FROM
              playlist_song_activities psa
            INNER JOIN
              users u ON psa.user_id = u.id
            INNER JOIN
              songs s ON psa.song_id = s.id
            WHERE
              psa.playlist_id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = PlaylistSongActivitiesService
