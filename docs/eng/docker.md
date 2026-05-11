# Docker Guide

## What is Docker?

Docker is a containerization platform that packages your entire application—including dependencies, runtime, and configurations—into a portable, isolated unit called a **container**. A container is like a lightweight virtual machine that ensures your tests run consistently across different machines: laptop, CI/CD pipeline, or cloud server.

Think of it this way:

- **Without Docker**: "It works on my machine" — different environments have different Node versions, Playwright versions, system libraries, etc.
- **With Docker**: "It works in a container" — the container carries everything it needs; it works the same way everywhere.

## Benefits of Using Docker

### 1. **Environment Consistency**

- All team members and CI pipelines run tests in identical environments
- No "but it works on my machine" problems
- Eliminates version conflicts (Node, Yarn, Playwright, browsers)

### 2. **Isolated Execution**

- Tests run in isolation; they don't interfere with your host system
- No need to install browsers, dependencies on your local machine
- Keeps your development environment clean

### 3. **Easy CI/CD Integration**

- Pre-built containers with all dependencies ready
- Faster pipeline execution (cached layers mean faster builds)
- Reproducible test results across all environments

### 4. **Evidence Capture**

- Videos, screenshots, and reports are automatically collected
- Volumes map container output back to your host machine
- Perfect for debugging flaky tests or collecting evidence

### 5. **Scalability**

- Run multiple test instances in parallel containers
- Prepare for future distributed test execution
- Foundation for cross-browser testing strategies

## Docker Files in the `container/` Folder

### 1. **Dockerfile**

The Dockerfile is the blueprint for building your test container image.

```dockerfile
FROM mcr.microsoft.com/playwright:v1.59.0-noble
```

- Starts with a pre-built image that includes Playwright, Node, and browsers
- Saves time and ensures browser compatibility

```dockerfile
ENV CI=true \
    CUCUMBER_HEADLESS=1 \
    CUCUMBER_VIDEO=0
```

- Sets environment variables for the container
- `CI=true` signals we're in a CI environment
- `CUCUMBER_VIDEO=0` disables video by default (can override with CLI)

```dockerfile
RUN corepack enable
```

- Enables Corepack to manage Yarn (required for Yarn 4.x)

```dockerfile
COPY package.json .yarnrc.yml yarn.lock ./
RUN yarn install --immutable
```

- Copies dependency files and installs with frozen lockfile
- Ensures reproducible installs; no unexpected updates

```dockerfile
COPY . .
```

- Copies your entire project into the container
- Everything needed for tests is now inside

```dockerfile
ENTRYPOINT ["container/docker-entrypoint.sh"]
CMD ["yarn", "test:pw:headless:video"]
```

- Sets the entrypoint script (prepares writable output directories)
- Default command (can be overridden by `docker compose run`)

### 2. **docker-compose.yml**

Compose orchestrates multiple containers and defines how they interact.

```yaml
services:
  playwright:
    build:
      context: ..
      dockerfile: container/Dockerfile
      network: host
```

- `playwright` service builds from the Dockerfile
- `context: ..` means the build context is the repository root
- `dockerfile: container/Dockerfile` specifies the path to the Dockerfile
- `network: host` improves build reliability in some environments

```yaml
network_mode: host
user: root
```

- `network_mode: host` avoids bridge-network creation issues in restricted Docker environments
- `user: root` ensures the entrypoint can prepare output directories and permissions before the test command runs

```yaml
environment:
  - CI=true
  - CUCUMBER_HEADLESS=1
  - CUCUMBER_VIDEO=0
```

- Sets runtime environment variables for this service

```yaml
volumes:
  - ../reports:/app/reports
  - ../test-results:/app/test-results
  - ../allure-results:/app/allure-results
```

- Maps directories from your host machine into the container
- Test outputs flow back to your host automatically
- Videos and reports end up in `./reports/`, `./test-results/`, etc.

**Three services are defined:**

- **playwright** — runs Playwright tests (raw)
- **cucumber** — runs Cucumber BDD tests
- **api** — runs API tests

Each can run independently or together.

### 3. **docker-entrypoint.sh**

The entrypoint script runs before any command inside the container.

```bash
#!/bin/sh
set -e

for dir in allure-results cucumber-reports reports reports/playwright test-results test-results/playwright; do
  mkdir -p "$dir"
done
```

- Creates output directories if they don't exist
- Ensures directories are ready for volume mounts

```bash
chmod -R 777 allure-results cucumber-reports reports test-results
```

- Ensures output directories stay writable even when the Docker base image maps execution to `pwuser` (`uid=1001`)
- This is a pragmatic workaround for bind-mounted artifact folders in restricted Linux environments

```bash
exec "$@"
```

- Runs the configured command after preparing the output directories

## Basic Docker Commands

### Build Container Images

```bash
yarn docker:build
```

Equivalent to:

```bash
docker compose -f container/docker-compose.yml build
```

Builds (or rebuilds) images for all services. Run this after updating `package.json` or the Dockerfile.

### Clean Generated Artifacts

```bash
yarn docker:clean
```

Runs the repository cleanup script through a temporary Docker container with `--network host`. This is useful when old artifacts were created with Docker ownership and are difficult to delete directly from the host.

### Run Tests with Video Evidence

**Full suite (Playwright + Cucumber pt-br + eng):**

```bash
yarn docker:test:all:video
```

This shortcut runs Playwright first and then Cucumber for all supported locales in sequence (`pt-br` then `eng`).

**Playwright tests:**

```bash
yarn docker:test:pw:video
```

Videos saved to `./reports/playwright/`

This shortcut runs:

```bash
docker compose -f container/docker-compose.yml run --rm -e PW_VIDEO_MODE=on playwright sh -lc 'yarn test:pw:headless:video'
```

**Cucumber tests (PT-BR):**

```bash
yarn docker:test:cucumber:video:pt-br
```

Videos and reports saved to `./test-results/` and `./cucumber-reports/`

This shortcut runs:

```bash
docker compose -f container/docker-compose.yml run --rm -e CUCUMBER_VIDEO=1 -e FEATURE_LOCALE=pt-br cucumber sh -lc 'yarn test:cucumber:headless:video'
```

**Cucumber tests (ENG):**

```bash
yarn docker:test:cucumber:video:eng
```

Videos and reports saved to `./test-results/` and `./cucumber-reports/`

This shortcut runs:

```bash
docker compose -f container/docker-compose.yml run --rm -e CUCUMBER_VIDEO=1 -e FEATURE_LOCALE=eng cucumber sh -lc 'yarn test:cucumber:headless:video'
```

**API tests:**

```bash
yarn docker:test:api:video
```

Reports saved to `./allure-results/`

This shortcut runs:

```bash
docker compose -f container/docker-compose.yml run --rm api sh -lc 'yarn test:api'
```

### Interactive Container Execution

Start containers in interactive mode (useful for debugging):

```bash
yarn docker:up
```

This starts all three services and keeps them running. Access container shells with:

```bash
docker exec -it container-playwright-1 /bin/sh
```

Stop containers:

```bash
yarn docker:down
```

### View Live Logs

```bash
yarn docker:logs
```

Streams logs from all running containers in real-time. Press `Ctrl+C` to exit.

### Generic Docker Compose Commands

For anything not covered by the shortcuts, use:

```bash
yarn docker:compose <command>
```

Examples:

```bash
yarn docker:compose ps                 # List running containers
yarn docker:compose exec playwright sh # Shell into a running container
yarn docker:compose logs playwright    # Logs from one service
yarn docker:compose run api bash       # Run a different command in api service
```

## Workflow: Running Tests in Docker

### 1. First Time Setup

```bash
# Build images (this caches layers, so it's fast next time)
yarn docker:build

# Clean previous generated artifacts when needed
yarn docker:clean

# Run full suite (Playwright + Cucumber pt-br + eng)
yarn docker:test:all:video

# Run Cucumber tests with video (PT-BR)
yarn docker:test:cucumber:video:pt-br

# Videos appear in ./test-results/ and ./cucumber-reports/
```

### 2. Development Loop

Modify your feature files or step definitions locally, then:

```bash
# Run tests again (uses cached image, faster)
yarn docker:test:cucumber:video:pt-br

# Check videos for failures
ls test-results/
```

### 3. Debugging a Failing Test

```bash
# Start containers interactively
yarn docker:up

# In another terminal, shell into the container
docker exec -it container-cucumber-1 /bin/sh

# Run a single feature manually
cd /app
yarn test:cucumber:headless:video --tags "@login"

# View logs from that specific run
```

### 4. Parallel Execution (CI/CD)

```bash
docker compose -f container/docker-compose.yml run --rm -e CUCUMBER_VIDEO=1 -e FEATURE_LOCALE=eng cucumber sh -lc 'yarn test:cucumber:workers:headless:video --tags "@web" --parallel 4'
```

Docker handles the parallelism inside the container.

## Troubleshooting Docker

### "permission denied while trying to connect to the Docker daemon"

Make sure Docker is running and your user is in the `docker` group:

```bash
sudo usermod -aG docker $USER
# Log out and back in
```

### "image not found" or build errors

Rebuild images:

```bash
yarn docker:build
```

If the Docker daemon in your environment cannot create bridge interfaces, prefer the existing project scripts and compose file as-is; they already use host networking for build and runtime.

### "permission denied" when removing files from `allure-results/`, `test-results/`, or `cucumber-reports`

This usually means previous container runs created bind-mounted artifacts with Docker-managed ownership.

Use the cleanup helper:

```bash
yarn docker:clean
```

If you still need a manual fallback:

```bash
sudo chown -R "$USER":"$USER" allure-results test-results cucumber-reports reports
sudo chmod -R u+rwX allure-results test-results cucumber-reports reports
```

### Videos or reports not appearing on host

Check volume mappings in `container/docker-compose.yml`. Videos should appear in:

- `./reports/` for Playwright
- `./test-results/` for Cucumber
- `./allure-results/` for Allure reports

If missing, check container logs:

```bash
yarn docker:logs
```

### Container exits immediately

Run with interactive mode to see the error:

```bash
docker compose -f container/docker-compose.yml run playwright /bin/sh
```

Then manually run a command to debug:

```bash
yarn test:pw:headless:video
```

## Next Steps

- Read [Running Tests](running-tests.md) for detailed test execution options
- See [Reporting](reporting.md) for how to visualize test results
- Check [Troubleshooting](troubleshooting.md) for more Docker-related tips
