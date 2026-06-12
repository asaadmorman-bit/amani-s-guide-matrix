#!/bin/bash
echo "🛡️ STARTING AMANI MATRIX LOCAL SERVICE..."
# 1. Run the local Deno core server
deno run --allow-net --allow-env entry.ts &
DENO_PID=$!

echo "📡 INITIALIZING SECURE CLOUDFLARE EDGE TUNNEL..."
# 2. Spin up an ephemeral Cloudflare tunnel pointing to Deno's port
npx @cloudflare/next-tunnel --port 8000

# Cleanup background processes on exit
kill $DENO_PID
