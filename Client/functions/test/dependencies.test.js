const test = require('node:test');
const assert = require('node:assert/strict');
const {generateKeyPairSync} = require('node:crypto');

test('the function entry point loads through CommonJS', () => {
  const {syncTechnologyCardsDaily} = require('../index');
  assert.equal(typeof syncTechnologyCardsDaily, 'function');
});

test('jwks-rsa resolves RSA signing keys with the pinned jose version', async () => {
  const jwksClient = require('jwks-rsa');
  const {publicKey} = generateKeyPairSync('rsa', {modulusLength: 2048});
  const client = jwksClient({
    jwksUri: 'https://example.invalid/.well-known/jwks.json',
    fetcher: async () => ({
      keys: [{...publicKey.export({format: 'jwk'}), kid: 'test-key', use: 'sig'}],
    }),
  });

  const signingKey = await client.getSigningKey('test-key');
  assert.equal(signingKey.getPublicKey(), publicKey.export({format: 'pem', type: 'spki'}));
});
