#instructions: 
#https://www.googlecloudcommunity.com/gc/Community-Blogs/No-servers-no-problem-A-guide-to-deploying-your-React/ba-p/690760


# Use the slim version of the node 20 image as our base
FROM node:20-slim

# Create a directory for our application in the container 
RUN mkdir -p /usr/src/app

# Set this new directory as our working directory for subsequent instructions
WORKDIR /usr/src/app

# Copy all files in the current directory into the container
COPY . .

# Set the PYTHONPATH environment variable, which is occasionally necessary for certain node packages
# 'PWD' is an environment variable that stores the path of the current working directory
ENV PYTHONPATH=${PYTHONPATH}:${PWD}

# Set the environment variable for the application's port
# (Be sure to replace '4200' with your application's specific port number if different)
ENV PORT 3000

# Install 'serve', a static file serving package globally in the container
RUN npm install -g serve

# Install all the node modules required by the React app
RUN npm install
# Build the React app
RUN npm run build

# Serve the 'build' directory on port 3000 using 'serve'
CMD ["serve", "-s", "-l", "3000", "./build"]


# To test the build
# 
# npm run build
# npm install -g serve
# npx serve -s build

# Once you have the container, add it to the artifact registry by:
    
# docker build  -t  starsof .

 # gcloud config set project starsof
 # gcloud auth login
 # gcloud builds submit -t us-central1-docker.pkg.dev/starsof/starsmap-react-frontend/starsof ./
