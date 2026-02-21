# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# RUN npm run build

# CMD ["npm", "start"]
# ---------- BUILD STAGE ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept API URL as build argument
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]