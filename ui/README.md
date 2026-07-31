# Ui

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Docker

The app is served as a static bundle behind nginx. API URLs are **not** baked into the build - they're read at container start-up from `config.json`, so the same image can be promoted across environments (dev/staging/prod) by just changing env vars, which is what Kubernetes Deployments should set.

Build the image:

```bash
docker build -t tmyts-ui .
```

Run it:

```bash
docker run -d -p 8080:8080 \
  -e API_BASE_URL=https://api.tmyts.yourdomain.com \
  -e WS_BASE_URL=wss://ws.tmyts.yourdomain.com \
  tmyts-ui
```

The app is then reachable at `http://localhost:8080/`.

### Container environment variables

| Variable | Purpose | Default (if unset) |
| --- | --- | --- |
| `API_BASE_URL` | Base URL of the HTTP API (job runs, assets, portfolios, users, indicators, etc.) | `http://localhost:8000` |
| `WS_BASE_URL` | Base URL of the WebSocket live-price service | `ws://localhost:8001` |

These are rendered into `config.json` at container start by `docker/render-config.sh` (runs automatically via nginx's `/docker-entrypoint.d/` hook) and fetched by the app before it bootstraps (`AppConfigService`). If a variable is unset, the container falls back to the `localhost` defaults above - fine for a quick local `docker run`, but every real deployment (including Kubernetes) must set both explicitly to reach the actual backend.

### Kubernetes

Set both variables on the container in the Deployment spec (directly or via a ConfigMap):

```yaml
env:
  - name: API_BASE_URL
    value: https://api.tmyts.yourdomain.com
  - name: WS_BASE_URL
    value: wss://ws.tmyts.yourdomain.com
```

The container listens on port `8080` and runs as a non-root user (`nginxinc/nginx-unprivileged` base), so it works under a `runAsNonRoot` PodSecurity policy without extra `securityContext` configuration.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
