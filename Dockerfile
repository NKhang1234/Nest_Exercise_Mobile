FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

RUN adduser --disabled-password --gecos "" appuser

# Copy the rest of the application code
COPY . .

RUN chown -R appuser:appuser /app

# Expose the port the app runs on
EXPOSE 3333

# Start the application
CMD ["npm", "run", "start:dev"]
