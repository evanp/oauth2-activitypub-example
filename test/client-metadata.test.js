import { expect } from '@esm-bundle/chai';

describe('Client Metadata', () => {
  let clientMetadata;

  beforeEach(async () => {
    const response = await fetch('/client.jsonld');
    clientMetadata = await response.json();
  });

  it('should load client.jsonld successfully', () => {
    expect(clientMetadata).to.be.an('object');
  });

  it('should have correct ID', () => {
    expect(clientMetadata.id).to.equal('https://evanp.github.io/oauth2-activitypub-example/client.jsonld');
  });

  it('should have correct name', () => {
    expect(clientMetadata.name).to.equal('ActivityPub OAuth 2.0 Sample Client');
  });

  it('should be of type Application', () => {
    expect(clientMetadata.type).to.equal('Application');
  });

  it('should have correct redirect URI', () => {
    expect(clientMetadata.redirectURI).to.equal('https://evanp.github.io/oauth2-activitypub-example/');
  });

  it('should include required @context', () => {
    expect(clientMetadata['@context']).to.include('https://www.w3.org/ns/activitystreams');
    expect(clientMetadata['@context']).to.include('https://purl.archive.org/socialweb/oauth');
  });

  it('should include icon as Link object', () => {
    expect(clientMetadata.icon.type).to.equal('Link');
    expect(clientMetadata.icon.href).to.equal('https://evanp.github.io/oauth2-activitypub-example/icon.png');
    expect(clientMetadata.icon.mediaType).to.equal('image/png');
  });

  it('should include attributedTo without icon', () => {
    expect(clientMetadata.attributedTo.name).to.equal('OAuth 2.0 ActivityPub Example');
    expect(clientMetadata.attributedTo.id).to.equal('https://evanp.github.io/oauth2-activitypub-example/organization');
    expect(clientMetadata.attributedTo.type).to.equal('Organization');
    expect(clientMetadata.attributedTo).to.not.have.property('icon');
  });

  it('should have required fields for OAuth 2.0', () => {
    const required = ['id', 'name', 'type', 'redirectURI'];
    for (const field of required) {
      expect(clientMetadata).to.have.property(field);
    }
  });
});