# 1. Use Node.js image
FROM node:18

# 2. Set working folder inside Docker
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy all other files
COPY . .

# 5. Expose port 3000 (or whatever your app uses)
EXPOSE 3000

# 6. Start the app using npm
CMD ["npm", "start"]
