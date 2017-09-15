function getFileNameFromPath(path) {
  return path.replace(/^.*[\\\/]/, '')
}

exports.getName = function(data) {
  if (data.bittorrent) {
    if (data.bittorrent.info) {
      return data.bittorrent.info.name
    }
  }
  if (data.files[0].path === "") {
    return data.files[0].uris[0].uri
  } else {
    return getFileNameFromPath(data.files[0].path)
  }
}
