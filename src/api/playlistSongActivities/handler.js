const autoBind = require("auto-bind");
const mapDBtoModelActivities =
  require("../../utils/index").mapDBtoModelActivities;

class PlaylistSongActivitiesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async getPlaylistSongActivitiesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const playlistSongActivities =
      await this._service.getPlaylistSongActivities(credentialId, playlistId);

    const activities = mapDBtoModelActivities(playlistSongActivities);

    return {
      status: "success",
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistSongActivitiesHandler;
