#!/usr/bin/env bash

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-root@173.237.189.106}"
REMOTE_PORT="${REMOTE_PORT:-6543}"
REMOTE_ENV_FILE="${REMOTE_ENV_FILE:-/opt/healsend-next-preview/deploy/.env.preview}"

remote_script="$(mktemp)"
cleanup() {
  rm -f "$remote_script"
}
trap cleanup EXIT

cat >"$remote_script" <<'EOF'
#!/usr/bin/env bash

set -euo pipefail

ENVF="${1:?missing env path}"

get_wp_option_field() {
  local option="$1"
  local field="$2"
  db_query "SELECT option_value FROM wp_options WHERE option_name='${option}' LIMIT 1;" |
    FIELD="$field" perl -0777 -ne '
      my $field = $ENV{FIELD};
      if (/s:\d+:"\Q$field\E";s:\d+:"(.*?)";/s) {
        my $value = $1;
        if ($field eq "private_key") {
          $value =~ s/\r\n|\n|\r/\\n/g;
        }
        print $value;
      }
    '
}

get_wp_const() {
  local name="$1"
  docker exec wordpress-prod sh -lc "grep -m1 \"^define( '${name}',\" /var/www/html/wp-config.php | sed -E \"s/.*'${name}', '([^']+)'.*/\\1/\""
}

DB_HOST="$(docker exec wordpress-prod sh -lc 'printf %s "$WORDPRESS_DB_HOST"')"
DB_NAME="$(docker exec wordpress-prod sh -lc 'printf %s "$WORDPRESS_DB_NAME"')"
DB_USER="$(docker exec wordpress-prod sh -lc 'printf %s "$WORDPRESS_DB_USER"')"
DB_PASSWORD="$(docker exec wordpress-prod sh -lc 'printf %s "$WORDPRESS_DB_PASSWORD"')"

db_query() {
  local sql="$1"
  docker exec wp-mysql-prod mysql -u"$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -N -e "$sql" 2>/dev/null
}

strip_cr() {
  tr -d '\r'
}

escape_sed() {
  printf '%s' "$1" | sed -e 's/[\\&|]/\\&/g'
}

set_kv() {
  local key="$1"
  local value="$2"
  local esc
  esc="$(escape_sed "$value")"

  if grep -q "^${key}=" "$ENVF"; then
    sed -i "s|^${key}=.*$|${key}=${esc}|" "$ENVF"
  else
    printf '%s=%s\n' "$key" "$value" >>"$ENVF"
  fi
}

mask() {
  local value="$1"
  local len="${#value}"

  if [[ -z "$value" ]]; then
    printf '<empty>'
    return
  fi

  if (( len <= 8 )); then
    printf '%s***%s' "${value:0:2}" "${value: -2}"
    return
  fi

  printf '%s***%s' "${value:0:4}" "${value: -4}"
}

stripe_secret="$(get_wp_option_field woocommerce_stripe_settings test_secret_key | strip_cr)"
stripe_publishable="$(get_wp_option_field woocommerce_stripe_settings test_publishable_key | strip_cr)"
stripe_webhook_secret="$(get_wp_const STRIPE_WEBHOOK_SECRET | strip_cr)"

google_client_id="$(get_wp_option_field nsl_google client_id | strip_cr)"
google_client_secret="$(get_wp_option_field nsl_google client_secret | strip_cr)"

apple_client_id="$(get_wp_option_field nsl_apple client_id | strip_cr)"
apple_team_id="$(get_wp_option_field nsl_apple team_identifier | strip_cr)"
apple_key_id="$(get_wp_option_field nsl_apple private_key_id | strip_cr)"
apple_private_key="$(get_wp_option_field nsl_apple private_key | strip_cr)"

ghl_api_key="$(get_wp_const HLD_GHL_API_TOKEN | strip_cr)"
mdi_client_id="$(get_wp_option_field mdintegrations_partner_integration_wc_options client_id | strip_cr)"
mdi_client_secret="$(get_wp_option_field mdintegrations_partner_integration_wc_options client_secret | strip_cr)"
mdi_partner_id="$(get_wp_option_field mdintegrations_partner_integration_wc_connect partner_id | strip_cr)"

set_kv STRIPE_SECRET_KEY "$stripe_secret"
set_kv NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "$stripe_publishable"
set_kv STRIPE_WEBHOOK_SECRET "$stripe_webhook_secret"

set_kv GOOGLE_CLIENT_ID "$google_client_id"
set_kv GOOGLE_CLIENT_SECRET "$google_client_secret"
set_kv GOOGLE_OAUTH_ENABLED false

set_kv APPLE_CLIENT_ID "$apple_client_id"
set_kv APPLE_TEAM_ID "$apple_team_id"
set_kv APPLE_KEY_ID "$apple_key_id"
set_kv APPLE_PRIVATE_KEY "$apple_private_key"
set_kv APPLE_OAUTH_ENABLED false

set_kv GHL_API_KEY "$ghl_api_key"
set_kv GHL_SYNC_ENABLED false
set_kv GHL_OAUTH_ENABLED false

set_kv MD_CLIENT_ID "$mdi_client_id"
set_kv MD_CLIENT_SECRET "$mdi_client_secret"
if [[ -n "$mdi_partner_id" ]]; then
  set_kv MD_PARTNER_ID "$mdi_partner_id"
fi
set_kv MD_API_BASE_URL https://api.mdintegrations.com
set_kv MD_WEBHOOK_URL https://api.mdintegrations.com/woocommerce/orders
set_kv MD_LOCAL_DEV_FALLBACK false

printf 'STRIPE_SECRET_KEY=%s\n' "$(mask "$stripe_secret")"
printf 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=%s\n' "$(mask "$stripe_publishable")"
printf 'STRIPE_WEBHOOK_SECRET=%s\n' "$(mask "$stripe_webhook_secret")"
printf 'GOOGLE_CLIENT_ID=%s\n' "$(mask "$google_client_id")"
printf 'GOOGLE_CLIENT_SECRET=%s\n' "$(mask "$google_client_secret")"
printf 'GOOGLE_OAUTH_ENABLED=false\n'
printf 'APPLE_CLIENT_ID=%s\n' "$(mask "$apple_client_id")"
printf 'APPLE_TEAM_ID=%s\n' "$(mask "$apple_team_id")"
printf 'APPLE_KEY_ID=%s\n' "$(mask "$apple_key_id")"
printf 'APPLE_PRIVATE_KEY=%s\n' "$(mask "$apple_private_key")"
printf 'APPLE_OAUTH_ENABLED=false\n'
printf 'GHL_API_KEY=%s\n' "$(mask "$ghl_api_key")"
printf 'GHL_SYNC_ENABLED=false\n'
printf 'GHL_OAUTH_ENABLED=false\n'
printf 'MD_CLIENT_ID=%s\n' "$(mask "$mdi_client_id")"
printf 'MD_CLIENT_SECRET=%s\n' "$(mask "$mdi_client_secret")"
printf 'MD_PARTNER_ID=%s\n' "$(mask "$mdi_partner_id")"
printf 'MD_API_BASE_URL=https://api.mdintegrations.com\n'
printf 'MD_WEBHOOK_URL=https://api.mdintegrations.com/woocommerce/orders\n'
printf 'MD_LOCAL_DEV_FALLBACK=false\n'
EOF

chmod 700 "$remote_script"

ssh -F /dev/null -p "${REMOTE_PORT}" "${REMOTE_HOST}" "cat >/tmp/sync-preview-vendor-env.sh && chmod 700 /tmp/sync-preview-vendor-env.sh" <"$remote_script"
ssh -F /dev/null -p "${REMOTE_PORT}" "${REMOTE_HOST}" "bash /tmp/sync-preview-vendor-env.sh '${REMOTE_ENV_FILE}'"
