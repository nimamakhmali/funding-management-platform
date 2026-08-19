# ─── Stage 1: Dependencies ───────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

# نصب pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* .npmrc* ./

RUN pnpm install --frozen-lockfile

# ─── Stage 2: Build ──────────────────────────────────────
FROM node:20-alpine AS builder

RUN npm install -g pnpm
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# متغیرهای build-time
ARG NEXT_PUBLIC_API_BASE_URL=http://5.198.179.184
ARG NEXT_PUBLIC_API_URL=http://5.198.179.184

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production

RUN pnpm build

# ─── Stage 3: Runner ─────────────────────────────────────
FROM node:20-alpine AS runner

RUN npm install -g pnpm
WORKDIR /app

ENV NODE_ENV=production

# کاربر غیر root برای امنیت
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# کپی فایل‌های build شده
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]