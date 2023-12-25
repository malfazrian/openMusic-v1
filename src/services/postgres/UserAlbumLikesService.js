const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class UserAlbumLikesService {
  constructor(albumsService, cacheService) {
    this._pool = new Pool();
    this._albumsService = albumsService;
    this._cacheService = cacheService;
  }

  async addLikes(userId, albumId) {
    await this._albumsService.verifyAlbumExist(albumId);

    const id = `likes-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal menyukai album");
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async deleteLikes(userId, albumId) {
    await this._albumsService.verifyAlbumExist(albumId);

    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal membatalkan menyukai album");
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getLikesCache(albumId) {
    const result = await this._cacheService.get(`likes:${albumId}`);

    if (!result) {
      throw new InvariantError("Jumlah suka gagal diakses");
    }

    return JSON.parse(result);
  }

  async getLikesDB(albumId) {
    await this._albumsService.verifyAlbumExist(albumId);
    const query = {
      text: "SELECT * FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Jumlah suka gagal diakses");
    }

    await this._cacheService.set(
      `likes:${albumId}`,
      JSON.stringify(result.rows.length)
    );

    return result.rows.length;
  }

  async checkLikes(userId, albumId) {
    const query = {
      text: "SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError("Anda telah menyukai album ini sebelumnya");
    }
  }
}

module.exports = UserAlbumLikesService;
