# Build context: monorepo root
# docker build -f apps/klarlabs.de/Dockerfile .
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/ui/package.json packages/ui/
COPY apps/klarlabs.de/package.json apps/klarlabs.de/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY apps/klarlabs.de/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/klarlabs.de/dist /usr/share/nginx/html
EXPOSE 8080
