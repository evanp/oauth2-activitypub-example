# ActivityPub OAuth 2.0 Sample Client

A browser-based sample client demonstrating OAuth 2.0 integration with ActivityPub APIs using the [FEP-d8c2 specification](https://fep.swf.pub/fep/d8c2/fep-d8c2.html).

## Features

- OAuth 2.0 Authorization Code flow with PKCE
- ActivityPub actor discovery via Webfinger
- Bearer token authentication
- Profile, inbox, and outbox browsing
- Activity posting to outbox
- Shoelace UI components

## Setup

1. Clone this repository
2. Serve the files using a local web server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```
3. Open `http://localhost:8000` in your browser

## Usage

1. Enter an ActivityPub actor URI or handle (e.g., `user@example.com`)
2. Click "Discover Actor" to find OAuth endpoints
3. Click "Authorize Application" to start OAuth flow
4. After authorization, browse profile data and post activities

## Client Metadata

The client is defined as an ActivityPub Application object at `/client.json` with:
- Client ID: `https://oauth2-activitypub-example.netlify.app/client`
- Redirect URI: `https://oauth2-activitypub-example.netlify.app/`
- Scopes: `read write`

## Implementation Details

- Uses PKCE (Proof Key for Code Exchange) with S256 method
- Follows FEP-d8c2 OAuth 2.0 profile for ActivityPub
- Implements Webfinger lookup for actor discovery
- Supports both direct URIs and handle format (@user@domain)

## Security

- No client secret required (public client)
- PKCE prevents authorization code interception
- Secure token storage in session storage
- CORS-aware implementation

## Notes

- Follow FEP-d8c2 specification strictly
- Use Shoelace components for consistent UI
- Ensure mobile-first responsive design
- Focus on security best practices
- Test with multiple ActivityPub implementations