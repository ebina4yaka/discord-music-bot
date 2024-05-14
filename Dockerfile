# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.13.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=9.1.1
RUN npm install -g pnpm@$PNPM_VERSION


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN echo "deb http://ftp.jp.debian.org/debian/ bookworm main contrib non-free non-free-firmware" > /etc/apt/sources.list && \
    echo "deb http://ftp.jp.debian.org/debian/ bookworm-updates main contrib non-free non-free-firmware" >> /etc/apt/sources.list
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy application code
COPY --link . .


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

ENV FFMPEG_PATH='/usr/bin/ffmpeg'

# Install ffmpeg
RUN echo "deb https://www.deb-multimedia.org bookworm main non-free" > /etc/apt/sources.list
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y ffmpeg

# Start the server by default, this can be overwritten at runtime
CMD [ "pnpm", "run", "start" ]
