# Base image
FROM node:22-alpine AS base

# Set pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy project
COPY . /app
WORKDIR /app

# Install all dependencies and build the project
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# --dangerously-allow-all-builds
RUN pnpm run build

# Install production dependencies
# FROM base AS prod-deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Production output
FROM base AS runner
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.output /app/
RUN rm -r app
EXPOSE 3000

CMD ["node", "/app/server/index.mjs"]
