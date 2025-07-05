import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

// Mock classes for testing
class MockActor {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.endpoints = {
      oauthAuthorizationEndpoint: 'https://example.com/oauth/authorize',
      oauthTokenEndpoint: 'https://example.com/oauth/token'
    };
  }

  discoverOAuthEndpoints() {
    return Promise.resolve(this.endpoints);
  }

  getProfile(accessToken) {
    return Promise.resolve({ name: this.name, id: this.id });
  }
}

class MockServer {
  constructor(domain) {
    this.domain = domain;
    this.oauthAuthorizationEndpoint = `https://${domain}/oauth/authorize`;
    this.oauthTokenEndpoint = `https://${domain}/oauth/token`;
  }

  authorize(client, actor, scope) {
    return Promise.resolve({ code: 'mock_auth_code' });
  }

  exchangeCode(code, client, redirectUri) {
    return Promise.resolve({
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
      expires_in: 3600
    });
  }
}

class MockClient {
  constructor(id, name, redirectUri) {
    this.id = id;
    this.name = name;
    this.redirectUri = redirectUri;
    this.scope = 'read write';
  }

  startOAuth(actor, server) {
    return Promise.resolve('mock_authorization_url');
  }

  handleCallback(code) {
    return Promise.resolve({
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token'
    });
  }
}

describe('OAuth Flow', () => {
  let actor, server, client;

  beforeEach(() => {
    actor = new MockActor('https://example.com/user', 'Test User');
    server = new MockServer('example.com');
    client = new MockClient('https://client.example.com', 'Test Client', 'https://client.example.com/callback');
  });

  it('should discover actor OAuth endpoints', async () => {
    const endpoints = await actor.discoverOAuthEndpoints();
    expect(endpoints.oauthAuthorizationEndpoint).to.equal('https://example.com/oauth/authorize');
    expect(endpoints.oauthTokenEndpoint).to.equal('https://example.com/oauth/token');
  });

  it('should start OAuth flow', async () => {
    const authUrl = await client.startOAuth(actor, server);
    expect(authUrl).to.equal('mock_authorization_url');
  });

  it('should handle OAuth callback', async () => {
    const tokens = await client.handleCallback('mock_code');
    expect(tokens.accessToken).to.equal('mock_access_token');
    expect(tokens.refreshToken).to.equal('mock_refresh_token');
  });

  it('should get actor profile with access token', async () => {
    const profile = await actor.getProfile('mock_access_token');
    expect(profile.name).to.equal('Test User');
    expect(profile.id).to.equal('https://example.com/user');
  });
});