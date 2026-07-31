# --- Build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# --- Serve ---
# Unprivileged variant: runs as a non-root user out of the box and listens
# on 8080 instead of 80, which matches typical Kubernetes PodSecurity
# policies (runAsNonRoot) without extra securityContext plumbing.
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx docker/render-config.sh /docker-entrypoint.d/30-render-config.sh
RUN chmod +x /docker-entrypoint.d/30-render-config.sh
COPY --from=build --chown=nginx:nginx /app/dist/ui/browser /usr/share/nginx/html

EXPOSE 8080
