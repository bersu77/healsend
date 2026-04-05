# HealSend Preview Deployment on Existing VPS

This guide deploys the custom Next.js app to the same VPS that currently serves `healsend.com`, but on a separate preview subdomain:

- preview host: `healsend.barikhan.studio`
- live WordPress host remains untouched: `healsend.com`

## Deployment shape

- app runtime: Docker container built from this repo
- preview database: separate Postgres container
- reverse proxy: existing Nginx container in `/opt/docker/apps`
- preview upstream name on Docker network: `healsend-next-preview-app`

This keeps the preview isolated from the live WordPress stack.

The preview image is intended to build from `deploy/.env.preview`, not the root local `.env`, so make sure the checked-in `.dockerignore` and preview Dockerfile stay in place when syncing to the VPS.

## Files used

- Docker image: [deploy/Dockerfile.preview](/home/barikhan/projects/eden-product-page(1)/deploy/Dockerfile.preview)
- Preview compose: [deploy/docker-compose.preview.yml](/home/barikhan/projects/eden-product-page(1)/deploy/docker-compose.preview.yml)
- Preview env template: [deploy/.env.preview.example](/home/barikhan/projects/eden-product-page(1)/deploy/.env.preview.example)
- Nginx server block: [deploy/nginx/healsend.barikhan.studio.conf](/home/barikhan/projects/eden-product-page(1)/deploy/nginx/healsend.barikhan.studio.conf)

## Server paths used

- app code: `/opt/healsend-next-preview`
- reverse proxy config dir: `/opt/docker/apps/data/nginx`
- reverse proxy compose dir: `/opt/docker/apps`

## 1. Sync code to the VPS

Example:

```bash
rsync -az --exclude='.git' --exclude='node_modules' --exclude='.next' -e 'ssh -p 6543' ./ root@173.237.189.106:/opt/healsend-next-preview/
```

## 2. Create preview env file on the VPS

On the VPS:

```bash
cp /opt/healsend-next-preview/deploy/.env.preview.example /opt/healsend-next-preview/deploy/.env.preview
```

Then edit:

- `NEXT_PUBLIC_APP_URL`
- Stripe keys
- MDI values
- optional OAuth / GHL values
- WordPress import values if you want the preview to resolve the imported long-tail marketing pages too

```bash
NEXT_PUBLIC_APP_URL=https://healsend.barikhan.studio
```

For MDI preview testing, use the provider API base plus the direct WooCommerce order endpoint, and keep local fallback off:

```bash
MD_API_BASE_URL=https://api.mdintegrations.com
MD_WEBHOOK_URL=https://api.mdintegrations.com/woocommerce/orders
MD_LOCAL_DEV_FALLBACK=false
```

For WordPress parity on preview, also set:

```bash
WORDPRESS_SSH_HOST=173.237.189.106
WORDPRESS_SSH_PORT=6543
WORDPRESS_SSH_USER=root
WORDPRESS_DB_CONTAINER=wp-mysql-prod
WORDPRESS_DB_NAME=wordpress
WORDPRESS_DB_USER=REPLACE_ME
WORDPRESS_DB_PASSWORD=REPLACE_ME
WORDPRESS_SITE_URL=https://healsend.com
```

## 3. Start preview Postgres and bootstrap data

```bash
cd /opt/healsend-next-preview
docker compose -f deploy/docker-compose.preview.yml up -d postgres
docker compose -f deploy/docker-compose.preview.yml run --rm app npm run db:generate
docker compose -f deploy/docker-compose.preview.yml run --rm app npm run db:push
docker compose -f deploy/docker-compose.preview.yml run --rm app npm run seed:dev-data
docker compose -f deploy/docker-compose.preview.yml run --rm app npm run seed:onboarding-templates
```

If you want the preview to include the imported WordPress marketing/product content instead of only the local development seed, run the WordPress import after the base seed:

```bash
docker compose -f deploy/docker-compose.preview.yml exec -T app npm run import:wordpress:content
```

## 4. Start the preview app

```bash
cd /opt/healsend-next-preview
docker compose -f deploy/docker-compose.preview.yml up -d --build app
```

## 5. Install the Nginx preview server block

Copy:

```bash
cp /opt/healsend-next-preview/deploy/nginx/healsend.barikhan.studio.conf /opt/docker/apps/data/nginx/healsend.barikhan.studio.conf
```

Validate and reload:

```bash
docker exec apps-reverseproxy-1 nginx -t
docker exec apps-reverseproxy-1 nginx -s reload
```

## 6. HTTP verification

From the VPS:

```bash
curl -I http://127.0.0.1 -H 'Host: healsend.barikhan.studio'
curl -s http://127.0.0.1 -H 'Host: healsend.barikhan.studio' | head
```

## 7. TLS after DNS propagation

When `healsend.barikhan.studio` resolves publicly to this VPS, issue the certificate from `/opt/docker/apps`:

```bash
cd /opt/docker/apps
docker compose run --rm --entrypoint certbot certbot certonly --webroot -w /var/www/certbot -d healsend.barikhan.studio --agree-tos --register-unsafely-without-email --non-interactive
```

The checked-in preview Nginx config already includes the `443` server block using:

- `/etc/letsencrypt/live/healsend.barikhan.studio/fullchain.pem`
- `/etc/letsencrypt/live/healsend.barikhan.studio/privkey.pem`
- `/etc/letsencrypt/live/healsend.barikhan.studio/chain.pem`

After the cert is issued, copy the latest config and reload Nginx again.

## 8. Useful runtime checks

```bash
docker compose -f deploy/docker-compose.preview.yml ps
docker compose -f deploy/docker-compose.preview.yml logs --tail=100 app
docker compose -f deploy/docker-compose.preview.yml logs --tail=100 postgres
curl -I http://127.0.0.1 -H 'Host: healsend.barikhan.studio'
```

## Current status

This preview deploy supports:

- isolated Docker runtime
- separate Postgres database
- HTTP and HTTPS on `healsend.barikhan.studio`
- LetsEncrypt certificate issuance through the existing VPS certbot stack
