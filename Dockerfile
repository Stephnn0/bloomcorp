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

# Generate Prisma client
RUN npx prisma generate

# Build the application (assuming you have a build script in package.json)
RUN npm run build

# Expose the port the app will run on (usually 3000 for Node.js apps)
EXPOSE 3000

# Command to start the app
CMD ["npm", "run", "start"]