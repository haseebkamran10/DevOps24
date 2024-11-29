# Use the official Node.js image
FROM node:22 AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci  # `npm ci` ensures a clean, repeatable build environment

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Serve the app using Nginx
FROM nginx:1.25-alpine  
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist . 

# Remove default Nginx configuration and replace with a custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
