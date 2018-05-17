class SpotifyAuthorizationError extends Error {
  constructor (error) {
    super(error);
    this.message = 'Spotify authorization failed. ' + error.message;
  }
}

class SpotifyApiError extends Error {
  constructor (error, statusCode) {
    super(error);
    this.message = 'Spotify API error: ' + statusCode + '. ' + error.message;
  }
}

module.exports = {
  SpotifyAuthorizationError,
  SpotifyApiError
};
