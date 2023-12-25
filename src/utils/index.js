function mapDBtoModel (playlistSongs) {
  const playlistId = playlistSongs[0].playlist_id
  const playlistName = playlistSongs[0].playlist_name
  const username = playlistSongs[0].username

  const formattedSongs = playlistSongs.map((song) => ({
    id: song.song_id,
    title: song.song_title,
    performer: song.song_performer
  }))

  return {
    id: playlistId,
    name: playlistName,
    username,
    songs: formattedSongs
  }
}

function mapDBtoModelActivities (activities) {
  const formattedActivities = activities.map((activity) => ({
    username: activity.username,
    title: activity.title,
    action: activity.action,
    time: activity.time
  }))

  return formattedActivities
}

module.exports = { mapDBtoModel, mapDBtoModelActivities }
