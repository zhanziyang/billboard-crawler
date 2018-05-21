var expect = require('chai').expect
const { string2Route } = require('./../utils')

describe('string2Route', () => {
  it('should clear up unknown characters', () => {
    expect(string2Route('a*b')).to.equal('ab')
    expect(string2Route('a+b')).to.equal('ab')
    expect(string2Route('a-b')).to.equal('ab')
    expect(string2Route('a.b')).to.equal('ab')
    expect(string2Route('a$b')).to.equal('ab')
  })

  it('should join words with dash', () => {
    expect(string2Route('foo bar')).to.equal('foo-bar')
  })

  it('should convert the string to lower-case', () => {
    expect(string2Route('Foo bAr')).to.equal('foo-bar')
  })
})
