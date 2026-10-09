#!/bin/sh
set -eu
cd /workspace
node scripts/preview.mjs stop || true
want=4cb0c625ac00c62390129b55a52596b52f10decd
root=/tmp/store-zero-main
current=""
if curl -sf --max-time 1 http://127.0.0.1:8091/health >/tmp/store-health.json 2>/dev/null; then
  current=$(node -e "try{process.stdout.write(String(JSON.parse(require('fs').readFileSync('/tmp/store-health.json','utf8')).release||''))}catch(e){}")
fi
if [ "$current" != "$want" ] && [ -d "$root" ]; then
  for p in /proc/[0-9]*; do
    if tr "\0" " " 2>/dev/null < "$p/cmdline" | grep -q "src/service/server.mjs"; then
      kill "$(basename "$p")" 2>/dev/null || true
    fi
  done
  sleep 0.4
  STORE_ZERO_RELEASE="$want" HOST=127.0.0.1 PORT=8091 node "$root/src/service/server.mjs" >>/tmp/store-zero.log 2>&1 &
fi
export STORE_ZERO_ORIGIN="${STORE_ZERO_ORIGIN:-http://127.0.0.1:8091}"
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
