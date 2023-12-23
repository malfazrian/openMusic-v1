const AlbumsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "albums",
  version: "2.0.0",
  register: async (server, { service, validator, coverValidator }) => {
    const albumsHandler = new AlbumsHandler(service, validator, coverValidator);
    server.route(routes(albumsHandler));
  },
};
