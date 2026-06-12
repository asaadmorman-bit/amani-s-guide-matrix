# Use the official ultra-lightweight Deno alpine layer
FROM denoland/deno:alpine-1.45.0

# Open the network port for ingress traffic
EXPOSE 8000

WORKDIR /app

# Cache dependencies and transfer source scripts
COPY entry.ts .
RUN deno cache entry.ts

# Run as a non-root service user for enhanced security hardening
USER deno

CMD ["run", "--allow-net", "--allow-env", "entry.ts"]
