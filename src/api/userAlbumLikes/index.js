const UserAlbumLikesHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'userAlbumLikes',
  version: '3.0.0',
  register: async (server, { userAlbumLikesService }) => {
    const userAlbumLikesHandler = new UserAlbumLikesHandler(
      userAlbumLikesService
    )
    server.route(routes(userAlbumLikesHandler))
  }
}
