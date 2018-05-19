var expect = require('chai').expect
const SpotifyWebApi = require('spotify-web-api-node')
var { SpotifyHelper } = require('./..')

const SPOTIFY_CLIENT_ID = 'ae8b20141d3242b8882a2e4678b6c633'
const SPOTIFY_CLIENT_SECRET = 'e07acc12a2744841bcc6e03284211ca5'

const spotifyHelpler = new SpotifyHelper(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)

describe('constructor()', () => {
  it('should have expected properties', () => {
    expect(spotifyHelpler).to.have.property('isAuthorized', false)
    expect(spotifyHelpler).to.be.instanceOf(SpotifyWebApi)
  })

  it('should authorize', async () => {
    await spotifyHelpler.authorize()
    expect(spotifyHelpler.isAuthorized).to.equal(true)
  })

  it('should resolve a track', async () => {
    const track = await spotifyHelpler.searchTrack('Rihanna', 'Only Girl')
    expect(track).to.include.keys(['id', 'name', 'album', 'artists'])
    expect(track.name).to.equal('Only Girl (In The World)')
  })
})
