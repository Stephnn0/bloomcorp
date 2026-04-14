FROM node:20-alpine

# Install OpenSSL
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependencies installation
COPY package.json package-lock.json ./

# Install dependencies (both production and development)
RUN npm ci

# Copy the entire application including prisma folder
COPY . .

# --- ADD THESE LINES HERE ---
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG DATABASE_URL
ARG SESSION_SECRET
ARS AWS_REGION 
ARS AWS_ACCESS_KEY_ID
ARS AWS_SECRET_ACCESS_KEY
ARS AWS_S3_BUCKET

    
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV DATABASE_URL=$DATABASE_URL
ENV SESSION_SECRET=$SESSION_SECRET
ENV AWS_REGION=$AWS_REGION
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_S3_BUCKET=$AWS_S3_BUCKET
ENV NODE_ENV=production
# ----------------------------

# Generate Prisma client
RUN npx prisma generate

# Build the application (assuming you have a build script in package.json)
RUN npm run build

# Expose the port the app will run on (usually 3000 for Node.js apps)
EXPOSE 3000

# Command to start the app
CMD ["npm", "run", "start"]