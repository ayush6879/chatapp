#? This is for Backend of chatapp

# Use the official Node.js image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files from the main directory to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire content of the current directory to the working directory
COPY . .

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

# to start again - docker start cf46
# how to create an image and run that image on a docker container
# docker images

#Commands used - docker build -t imarchit/chatapp-backend .
#docker run -p 3000:3000 imarchit/chatapp-backend
# docker push imarchit/chatapp-backend   (for server)

