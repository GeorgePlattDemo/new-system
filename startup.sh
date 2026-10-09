#!/bin/sh
set -eu
cd /workspace
node scripts/preview.mjs stop || true
if [ -d /tmp/store-zero ] && ! curl -sf -o /dev/null --max-time 1 http://127.0.0.1:8091/health; then
  STORE_ZERO_RELEASE=d0c15fcd70b4357c8fa61d5505b95ec68cea8e65 HOST=127.0.0.1 PORT=8091 \
    node /tmp/store-zero/src/service/server.mjs >>/tmp/store-zero.log 2>&1 &
fi
export STORE_ZERO_ORIGIN="${STORE_ZERO_ORIGIN:-http://127.0.0.1:8091}"
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
