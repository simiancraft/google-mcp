# --- build stage -------------------------------------------------------------
# Build with Bun (the suite's toolchain: bun.lock, `bun run build` -> tsc).
FROM oven/bun:1.3.13 AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY tsconfig.base.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN bun run build

# --- production dependencies -------------------------------------------------
# A clean, dev-dependency-free node_modules for the runtime image.
FROM oven/bun:1.3.13 AS prod-deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# --- runtime stage -----------------------------------------------------------
# Run on Node: the bins are `#!/usr/bin/env node` and the HTTP server spawns the
# per-account children with `process.execPath`, so the runtime must be node.
FROM node:24-slim AS runtime
ENV NODE_ENV=production
ENV HOME=/home/node
# Put the google-mcp-* / google-mcp-doctor bins on PATH for `docker compose run`.
ENV PATH="/app/node_modules/.bin:${PATH}"
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Config/token directory (mount a volume here to persist OAuth tokens).
# Owned by `node` so a fresh named volume mounted here is writable.
RUN mkdir -p /home/node/.google-mcp && chown node:node /home/node/.google-mcp

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||3000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# The HTTP transport (`google-mcp-serve`): serve every service at /<account>/<service>.
CMD ["node", "dist/serve/index.js"]
