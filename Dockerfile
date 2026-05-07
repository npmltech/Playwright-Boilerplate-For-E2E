FROM mcr.microsoft.com/playwright:v1.59.0-noble

ENV CI=true \
    CUCUMBER_HEADLESS=1 \
    CUCUMBER_VIDEO=0

WORKDIR /app

# Enable Corepack for Yarn 4
RUN corepack enable

# Copy dependency files first for layer caching
COPY package.json .yarnrc.yml yarn.lock ./

# Install dependencies with frozen lockfile for reproducibility
RUN yarn install --immutable

# Copy project files
COPY . .

# Use non-root user provided by the Playwright image
USER pwuser

CMD ["yarn", "test:pw:headless:video"]
