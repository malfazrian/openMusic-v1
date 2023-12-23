const path = require("path");

const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: handler.postAlbumsHandler,
  },
  {
    method: "POST",
    path: "/albums/{albumId}/covers",
    handler: handler.postAlbumCoverHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
      },
    },
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: "GET",
    path: "/api/albums/file/images/{param*}", // Adjusted path pattern
    handler: {
      directory: {
        path: path.resolve(__dirname, "file", "images"),
      },
    },
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
  },
];

module.exports = routes;
