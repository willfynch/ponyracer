FROM node:latest

WORKDIR /ponyracer

# Install vim
RUN apt-get update && apt-get install -y vim

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps --force

# Expose port 4200 for the development server
EXPOSE 4200

# Command to start the development server
CMD ["ng", "serve", "--host", "0.0.0.0"]