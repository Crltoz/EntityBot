# node-canvas is the only awkward dependency here: it needs a toolchain and the
# cairo/pango headers to build, but only the shared libraries to run. Two stages
# keep those headers out of the shipped image.
FROM node:20.18.3-slim AS build

RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential python3 pkg-config \
      libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev


FROM node:20.18.3-slim AS runtime

# fontconfig is what lets Canvas.registerFont() pick up assets/Font/BRUTTALL.ttf
# instead of silently falling back to the default sans face.
RUN apt-get update && apt-get install -y --no-install-recommends \
      libcairo2 libpango-1.0-0 libpangocairo-1.0-0 \
      libjpeg62-turbo libgif7 librsvg2-2 \
      fontconfig \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# stats.js registers the font with a relative path, so the process has to start
# from /app for it to resolve.
CMD ["node", "index.js"]
