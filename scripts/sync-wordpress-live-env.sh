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

db_query() {
  local sql="$1"
  docker exec wp-mysql-prod mysql -uroot -p"HJkljejjOI76HGprod" -D wordpress -N -e "$sql" 2>/dev/null
}

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

get_php_define() {
  local constant_name="$1"
  local file_path="$2"
  docker exec wordpress-prod php -r '
    $constantName = $argv[1];
    $file = $argv[2];
    $contents = file_get_contents($file);
    if ($contents === false) {
      exit(1);
    }
    $value = "";
    foreach (preg_split("/\\R/", $contents) as $line) {
      if (preg_match("/^\\s*\\/\\//", $line)) {
        continue;
      }
      if (preg_match("/define\\(\\s*[\"\\x27]".$constantName."[\"\\x27]\\s*,\\s*[\"\\x27]([^\"\\x27]+)[\"\\x27]\\s*\\)/", $line, $m)) {
        $value = $m[1];
      }
    }
    if ($value !== "") {
      echo $value;
    }
  ' "$constant_name" "$file_path"
}

google_client_id="$(get_wp_option_field nsl_google client_id)"
google_client_secret="$(get_wp_option_field nsl_google client_secret)"

apple_client_id="$(get_wp_option_field nsl_apple client_id)"
apple_team_id="$(get_wp_option_field nsl_apple team_identifier)"
apple_key_id="$(get_wp_option_field nsl_apple private_key_id)"
apple_private_key="$(get_wp_option_field nsl_apple private_key)"

mdi_client_id="$(get_wp_option_field mdintegrations_partner_integration_wc_options client_id)"
mdi_client_secret="$(get_wp_option_field mdintegrations_partner_integration_wc_options client_secret)"
mdi_partner_id="$(get_wp_option_field mdintegrations_partner_integration_wc_connect partner_id)"

stripe_publishable_key="$(get_php_define STRIPE_PUBLISHABLE_KEY /var/www/html/wp-content/plugins/telegramd-patient-portal/includes/api-keys.php)"
stripe_secret_key="$(get_php_define STRIPE_SECRET_KEY /var/www/html/wp-content/plugins/telegramd-patient-portal/includes/api-keys.php)"
stripe_webhook_secret="$(get_php_define STRIPE_WEBHOOK_SECRET /var/www/html/wp-config.php)"

ghl_api_key="$(get_php_define GHL_API_KEY /var/www/html/wp-content/plugins/telegramd-patient-portal/includes/api-keys.php)"
ghl_all_forms_token="$(get_php_define HLD_GHL_API_TOKEN /var/www/html/wp-config.php)"

set_kv NEXT_PUBLIC_APP_URL "https://healsend.com"

set_kv STRIPE_SECRET_KEY "$stripe_secret_key"
set_kv NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "$stripe_publishable_key"
set_kv STRIPE_WEBHOOK_SECRET "$stripe_webhook_secret"

set_kv GOOGLE_CLIENT_ID "$google_client_id"
set_kv GOOGLE_CLIENT_SECRET "$google_client_secret"
set_kv GOOGLE_REDIRECT_URI "https://healsend.com/wp-login.php?loginSocial=google"
set_kv GOOGLE_OAUTH_ENABLED "true"

set_kv APPLE_CLIENT_ID "$apple_client_id"
set_kv APPLE_TEAM_ID "$apple_team_id"
set_kv APPLE_KEY_ID "$apple_key_id"
set_kv APPLE_PRIVATE_KEY "$apple_private_key"
set_kv APPLE_REDIRECT_URI "https://healsend.com/wp-login.php?loginSocial=apple"
set_kv APPLE_OAUTH_ENABLED "true"

set_kv GHL_API_KEY "$ghl_api_key"
if [[ -n "$ghl_all_forms_token" ]]; then
  set_kv HLD_GHL_API_TOKEN "$ghl_all_forms_token"
fi
set_kv GHL_SYNC_ENABLED "true"
set_kv GHL_OAUTH_ENABLED "false"

set_kv MD_API_BASE_URL "https://api.mdintegrations.com"
set_kv MD_WEBHOOK_URL "https://api.mdintegrations.com/woocommerce/orders"
set_kv MD_CLIENT_ID "$mdi_client_id"
set_kv MD_CLIENT_SECRET "$mdi_client_secret"
if [[ -n "$mdi_partner_id" ]]; then
  set_kv MD_PARTNER_ID "$mdi_partner_id"
fi
set_kv MD_LOCAL_DEV_FALLBACK "false"
set_kv MD_IS_SANDBOX "false"

printf 'Wrote live WordPress integrations into %s\n' "$ENVF"
EOF

chmod 700 "$remote_script"

ssh -F /dev/null -p "${REMOTE_PORT}" "${REMOTE_HOST}" "cat >/tmp/sync-wordpress-live-env.sh && chmod 700 /tmp/sync-wordpress-live-env.sh" <"$remote_script"
ssh -F /dev/null -p "${REMOTE_PORT}" "${REMOTE_HOST}" "bash /tmp/sync-wordpress-live-env.sh '${REMOTE_ENV_FILE}'"
