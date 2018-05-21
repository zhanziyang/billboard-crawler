function string2Route (str) {
  return str
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .join('-')
    .toLowerCase()
}

function splitArtists (str) {
  return str.split(/, | & | Featuring | Or | x /).map(item => item.trim())
}

module.exports = {
  string2Route,
  splitArtists
}
