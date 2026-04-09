# Demo Map App

## Pre-requisite
- Ensure you have Nodejs 18 or above installed in your pc

## Running backend api server

### Steps 
- Open the `vpv-demo-app` folder in a code editor (i.e. VS Code)
- Inside the `backend` folder, create a new `.env` file
- Copy over all the content from `.env.example` file to the newly created `.env` file
- In a command terminal, navigate to the `backend` folder
- Execute command `npm install`
- Once installation complete, execute command `npm run dev`
- Dev api server should start on `http://localhost:3000` url


## Running frontend webapp

### Steps 
- Open the `vpv-demo-app` folder in a code editor (i.e. VS Code)
- Inside the `web` folder, create a new `.env` file
- Copy over all the content from `.env.example` file to the newly created `.env` file
- In the `.env` file, you need to update the value of `VITE_GOOGLE_MAPS_API_KEY` property. You can obtain a key from here https://developers.google.com/maps/documentation/javascript/get-api-key
- In a command terminal, navigate to the `web` folder
- Execute command `npm install`
- Once installation complete, execute command `npm run dev`
- Dev api server should start on `http://localhost:5173` url
