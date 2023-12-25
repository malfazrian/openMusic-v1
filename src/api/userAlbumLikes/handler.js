const autoBind = require("auto-bind");

class UserAlbumLikesHandler {
  constructor(userAlbumLikesService) {
    this._userAlbumLikesService = userAlbumLikesService;

    autoBind(this);
  }

  async postAlbumLikesHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._userAlbumLikesService.checkLikes(userId, albumId);
    await this._userAlbumLikesService.addLikes(userId, albumId);

    const response = h.response({
      status: "success",
      message: "Album berhasil disukai",
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikesHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._userAlbumLikesService.deleteLikes(userId, albumId);

    const response = h.response({
      status: "success",
      message: "Menyukai album berhasil dibatalkan",
    });
    response.code(200);

    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    try {
      const likes = await this._userAlbumLikesService.getLikesCache(albumId);
      const response = h.response({
        status: "success",
        data: {
          likes: likes,
        },
      });
      response.header("X-Data-Source", "cache");
      response.code(200);

      return response;
    } catch (error) {
      const likes = await this._userAlbumLikesService.getLikesDB(albumId);

      const response = h.response({
        status: "success",
        data: {
          likes: likes,
        },
      });
      response.header("X-Data-Source", "database");
      response.code(200);

      return response;
    }
  }
}

module.exports = UserAlbumLikesHandler;
