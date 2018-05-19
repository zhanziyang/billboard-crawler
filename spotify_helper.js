const SpotifyWebApi = require('spotify-web-api-node')
const { SpotifyAuthorizationError, SpotifyApiError } = require('./errors')

module.exports = class SpotifyHelper extends SpotifyWebApi {
  constructor (clientId, clientSecret) {
    super({
      clientId,
      clientSecret
    })
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.isAuthorized = false
  }

  async init () {
    await this.authorize()
  }

  async ensureAuthorized () {
    if (!this.isAuthorized) {
      await this.authorize()
    }
  }

  async authorize () {
    try {
      const credentials = await this.clientCredentialsGrant()
      const { access_token, expires_in } = credentials.body
      this.setAccessToken(access_token)
      setTimeout(this.authorize.bind(this), (expires_in - 60) * 1000)
      this.isAuthorized = true
    } catch (err) {
      this.isAuthorized = false
      throw new SpotifyAuthorizationError(err)
    }
  }

  async searchTrack (artist, trackName) {
    await this.ensureAuthorized()
    const resp = await this.searchTracks(`track:${trackName} artist:${artist}`, {
      limit: 1
    })
    if (resp.statusCode === 200) {
      return resp.body.tracks.items[0]
    }
    throw SpotifyApiError(new Error(), resp.statusCode)
  }
}
