# Vendor Env Checklist

This doc maps the third-party auth/CRM setup directly to this repo's `.env` keys.

Source env declarations:
- [`.env.example`](/home/barikhan/projects/eden-product-page(1)/.env.example#L14)

Relevant callback code:
- Google: [src/app/api/auth/google/route.js](/home/barikhan/projects/eden-product-page(1)/src/app/api/auth/google/route.js#L11)
- Apple: [src/app/api/auth/apple/route.js](/home/barikhan/projects/eden-product-page(1)/src/app/api/auth/apple/route.js#L11)
- GHL OAuth: [src/lib/ghl-oauth.js](/home/barikhan/projects/eden-product-page(1)/src/lib/ghl-oauth.js#L18)
- GHL sync client: [src/lib/ghl.js](/home/barikhan/projects/eden-product-page(1)/src/lib/ghl.js#L9)

## Prerequisite

Set the real app URL first. All callback URLs depend on it.

```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## Google OAuth

### Where to get it

Use Google Cloud Console. Create an OAuth client of type `Web application`.

Official docs:
- https://developers.google.com/identity/protocols/oauth2/web-server
- https://support.google.com/cloud/answer/6158849

### Values to copy

- `GOOGLE_CLIENT_ID` = Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` = Google OAuth client secret
- `GOOGLE_OAUTH_ENABLED` = `true`

### Redirect URI to register

```text
https://your-domain.com/api/auth/google/callback
```

### Paste-ready block

```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"

GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_OAUTH_ENABLED=true
```

### CLI note

For this app, treat Google OAuth setup as console-driven. There is no repo-local CLI step that generates these values.

## Apple Sign in

### Where to get it

Use Apple Developer.

You need:
- a primary App ID with `Sign in with Apple` enabled
- a `Services ID` for the web flow
- a Sign in with Apple private key

Official docs:
- https://developer.apple.com/help/account/capabilities/configure-sign-in-with-apple-for-the-web
- https://developer.apple.com/help/account/configure-app-capabilities/create-a-sign-in-with-apple-private-key/

### Values to copy

- `APPLE_CLIENT_ID` = Apple `Services ID`
- `APPLE_TEAM_ID` = Apple Developer Team ID
- `APPLE_KEY_ID` = the Sign in with Apple key ID
- `APPLE_PRIVATE_KEY` = contents of the downloaded `.p8` file
- `APPLE_OAUTH_ENABLED` = `true`

### Return URL to register

```text
https://your-domain.com/api/auth/apple/callback
```

### Paste-ready block

If your env system supports multiline secrets:

```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"

APPLE_CLIENT_ID="com.yourcompany.healsend.web"
APPLE_TEAM_ID="YOUR_TEAM_ID"
APPLE_KEY_ID="YOUR_KEY_ID"
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_P8_CONTENT
-----END PRIVATE KEY-----"
APPLE_OAUTH_ENABLED=true
```

If your env system requires a single line, keep the newlines escaped:

```env
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_P8_CONTENT\n-----END PRIVATE KEY-----"
```

### CLI note

Apple setup is portal-driven. There is no normal CLI flow for provisioning these web-login credentials.

## GoHighLevel

This repo supports two different GHL env patterns.

## GHL account sync

Use this only if you need server-side contact/tag sync without the multi-tenant OAuth flow.

### Important repo note

The current sync client still points at `https://rest.gohighlevel.com/v1` in [src/lib/ghl.js](/home/barikhan/projects/eden-product-page(1)/src/lib/ghl.js#L9). HighLevel's current docs push `Private Integrations` and OAuth. Do not swap credential types blindly here without verifying compatibility.

### Values to copy

- `GHL_API_KEY` = the credential currently used by your live GHL sync path
- `GHL_SYNC_ENABLED` = `true`
- `GHL_OAUTH_ENABLED` = `false`

### Paste-ready block

```env
GHL_API_KEY="your-current-working-ghl-sync-credential"
GHL_SYNC_ENABLED=true
GHL_OAUTH_ENABLED=false
```

### Official docs

- https://marketplace.gohighlevel.com/docs/Authorization/authorization_doc
- https://marketplace.gohighlevel.com/docs/Authorization/PrivateIntegrationsToken/index.html

## GHL OAuth

Use this if you want the app to complete a HighLevel OAuth install flow.

### Where to get it

Create/register the app in HighLevel's developer or marketplace flow, then copy the client credentials.

### Values to copy

- `GHL_CLIENT_ID` = HighLevel OAuth client ID
- `GHL_CLIENT_SECRET` = HighLevel OAuth client secret
- `GHL_OAUTH_ENABLED` = `true`

### Redirect URI to register

```text
https://your-domain.com/api/ghl/oauth/callback
```

### Paste-ready block

```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"

GHL_CLIENT_ID="your-ghl-client-id"
GHL_CLIENT_SECRET="your-ghl-client-secret"
GHL_OAUTH_ENABLED=true
```

### CLI note

There is no normal vendor CLI flow here either. Create the app in HighLevel, copy the credentials, then store them in env.

## Safe defaults if you are not enabling them yet

If you are not ready to turn these on, leave them disabled.

```env
GOOGLE_OAUTH_ENABLED=false
APPLE_OAUTH_ENABLED=false
GHL_SYNC_ENABLED=false
GHL_OAUTH_ENABLED=false
```

## Recommended order

1. Set `NEXT_PUBLIC_APP_URL`.
2. Configure Stripe live values first, because those are the current hard non-MDI blockers.
3. Turn on Google only after its redirect URI is registered.
4. Turn on Apple only after the Services ID and return URL are registered.
5. Leave GHL off until you decide whether you want the current sync path, OAuth, or a later refactor.
