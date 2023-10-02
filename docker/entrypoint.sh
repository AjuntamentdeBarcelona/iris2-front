#!/bin/sh

set -e

case $1 in
    nginx-daemon)
        # Allow to force HTTP redirects
        if [ "${ENABLE_HTTPS_FORCE}" = "True" ]; then
            echo "Enable HTTP force for the /"
            sed -i -e "s/#ENABLE_HTTPS_FORCE //g" /etc/nginx/nginx.conf
        fi

        echo "→ Generating version..."
        V='${VERSION}'
        DATE=`date '+%Y%m%d%H%M'`
        sed -i s/$V/$DATE/g /etc/config.template.json

        echo "→ Creating config.json from env vars..."
        envsubst < /etc/config.template.json > /var/www/html/config.json
        cat -n /var/www/html/config.json
        echo ""

        nginx -T
        echo "→ Starting Nginx daemon..."
        exec nginx -g "daemon off;";
        ;;
    *)
        exec "$@"
        ;;
esac
