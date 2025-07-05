// OAuth 2.0 ActivityPub Client Application
class OAuthActivityPubClient {
    constructor() {
        this.clientId = 'https://evanp.github.io/oauth2-activitypub-example/client.jsonld';
        this.redirectUri = window.location.origin + window.location.pathname;
        this.scope = 'read';
        this.state = null;
        this.codeVerifier = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkForAuthResponse();
    }

    setupEventListeners() {
        const loginButton = document.getElementById('login-button');
        const logoutButton = document.getElementById('logout-button');
        const actorInput = document.getElementById('actor-input');

        if (loginButton) {
            loginButton.addEventListener('click', () => this.handleLogin());
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.handleLogout());
        }

        if (actorInput) {
            actorInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin();
                }
            });
        }
    }

    async handleLogin() {
        const actorInput = document.getElementById('actor-input');
        const actor = actorInput.value.trim();

        if (!actor) {
            this.showError('Please enter an ActivityPub actor');
            return;
        }

        try {
            this.setLoading(true);
            await this.startOAuthFlow(actor);
        } catch (error) {
            this.showError(`Login failed: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    handleLogout() {
        // Clear any stored tokens
        localStorage.removeItem('oauth_access_token');
        localStorage.removeItem('oauth_refresh_token');
        localStorage.removeItem('oauth_user_info');

        // Reset UI
        this.showLoginSection();
    }

    async startOAuthFlow(actor) {
        try {
            // Step 1: Discover the actor's OAuth endpoints
            const endpoints = await this.discoverOAuthEndpoints(actor);

            // Step 2: Generate PKCE parameters
            this.codeVerifier = this.generateCodeVerifier();
            const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
            this.state = this.generateState();

            // Step 3: Redirect to authorization endpoint
            const authUrl = this.buildAuthorizationUrl(endpoints.oauthAuthorizationEndpoint, {
                client_id: this.clientId,
                redirect_uri: this.redirectUri,
                scope: this.scope,
                response_type: 'code',
                state: this.state,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256'
            });

            window.location.href = authUrl;

        } catch (error) {
            throw new Error(`OAuth flow failed: ${error.message}`);
        }
    }

    async discoverOAuthEndpoints(actor) {
        // This will be implemented to discover OAuth endpoints via Webfinger
        // For now, return a mock implementation
        console.log('Discovering OAuth endpoints for actor:', actor);

        // Mock implementation - in real implementation, this would:
        // 1. Parse the actor to get domain
        // 2. Perform Webfinger lookup
        // 3. Extract OAuth endpoints from the response

        return {
            oauthAuthorizationEndpoint: 'https://example.com/oauth/authorize',
            oauthTokenEndpoint: 'https://example.com/oauth/token'
        };
    }

    generateCodeVerifier() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return this.base64URLEncode(array);
    }

    async generateCodeChallenge(codeVerifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return this.base64URLEncode(new Uint8Array(digest));
    }

    base64URLEncode(buffer) {
        return btoa(String.fromCharCode(...buffer))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    generateState() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return this.base64URLEncode(array);
    }

    buildAuthorizationUrl(endpoint, params) {
        const url = new URL(endpoint);
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        return url.toString();
    }

    checkForAuthResponse() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
            this.showError(`Authorization failed: ${error}`);
            return;
        }

        if (code && state) {
            // Verify state parameter
            if (state !== this.state) {
                this.showError('Invalid state parameter');
                return;
            }

            // Exchange code for token
            this.exchangeCodeForToken(code);
        }
    }

    async exchangeCodeForToken(code) {
        try {
            this.setLoading(true);

            // This will be implemented to exchange the authorization code for tokens
            // For now, simulate a successful token exchange

            const mockUserInfo = {
                name: 'Test User',
                preferredUsername: 'testuser',
                id: 'https://example.com/users/testuser'
            };

            // Store user info
            localStorage.setItem('oauth_user_info', JSON.stringify(mockUserInfo));

            // Show welcome message
            this.showWelcomeSection(mockUserInfo.name);

            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);

        } catch (error) {
            this.showError(`Token exchange failed: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    showWelcomeSection(userName) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('welcome-section').style.display = 'block';
        document.getElementById('user-name').textContent = userName;
        document.getElementById('welcome-section').classList.add('fade-in');
    }

    showLoginSection() {
        document.getElementById('welcome-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('actor-input').value = '';
    }

    showError(message) {
        const errorSection = document.getElementById('error-section');
        const errorMessage = document.getElementById('error-message');

        errorMessage.textContent = message;
        errorSection.style.display = 'block';
        errorSection.classList.add('fade-in');

        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorSection.classList.add('fade-out');
            setTimeout(() => {
                errorSection.style.display = 'none';
                errorSection.classList.remove('fade-out');
            }, 300);
        }, 5000);
    }

    setLoading(loading) {
        const loginButton = document.getElementById('login-button');
        const actorInput = document.getElementById('actor-input');

        if (loading) {
            loginButton.classList.add('loading');
            actorInput.disabled = true;
        } else {
            loginButton.classList.remove('loading');
            actorInput.disabled = false;
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OAuthActivityPubClient();
});