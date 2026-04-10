# VPV-Demo-Map

## Features
- User Authentication/Registration via Auth0; without authentication, user can't use this app
- Render a 2D map (google map) in the browser
- Allow user to `click` on the map to point a `location`
- The app `detects` the position of the location (via latitude and longitude)
- Makes API call to the google maps api to `retrieve` address for the selected location
- If `address` retrieved successfully, displays the address to the user, otherwise, displays the location to the user
- Allows user to `save` a location
- Allows user to view a list of all `saved` locations
- Allows user to `view` a `saved` location in the map again
- Allows user to `delete` a saved location from the list

## Tech stack
- Frontend: VueJS (via Vite), Vuex, Google Maps API
- Backend: NodeJS, Express
- Database: SQLite (via better-sqlite3)
- User Authentication: Auth0
- Docker
- AI assisted development

## Running the app locally
The app can be run in 2 ways locally
- Via Docker
- Via direct execution

### Pre-requisite
- Ensure you have Nodejs 18 or above installed in your pc
- Ensure you have docker desktop installed in your pc
- Get a copy of the codebase from here: https://github.com/vanuverma/vpv-demo-map

### Running using Docker

- Open a text editor (i.e. VS Code) and open the root `vpv-demo-app` folder
- Create a new `.env` file in the root `vpv-demo-app` folder
- Copy all content from the `.env.example` file to the `.env` file
- Update the variable values using the `keys` provided to you separately. Alternatively, you can obtain a key from here https://developers.google.com/maps/documentation/javascript/get-api-key
- If obtaining own key, ensure to enable `Maps JavaScript API` and `Geocoding API`
- Similarly, you can create your own tenant in Auth0 and create 2 projects there (one `app` for webapp, another `api` for backend) and use the keys accordingly. Ensure to update login, logout URLs as needed
- Open a command terminal and navigate to the root `vpv-demo-app` folder
- Ensure Docker is `running`
- In the terminal window, to start: `docker compose up --build`
- To stop without losing data: `docker compose down`
- To stop and remove existing data, use `docker compose down -v`
- Navigate to `http://localhost:5173` in your browser to use the app


### Running without Docker

#### Backend server running steps

- Open the `vpv-demo-app` folder in a code editor (i.e. VS Code)
- Inside the `backend` folder, create a new `.env` file
- Copy over all the content from `.env.example` file to the newly created `.env` file
- Update the value of environment variables with the values provided to you or with your own
- In a command terminal, navigate to the `backend` folder
- Execute command `npm install`
- Once installation complete, execute command `npm run dev`
- Dev api server should start on `http://localhost:3000` url


#### Frontend webapp running steps

- Open the `vpv-demo-app` folder in a code editor (i.e. VS Code)
- Inside the `web` folder, create a new `.env` file
- Copy over all the content from `.env.example` file to the newly created `.env` file
- Update the value of environment variables with the values provided to you or with your own
- In a command terminal, navigate to the `web` folder
- Execute command `npm install`
- Once installation complete, execute command `npm run dev`
- vpv-demo-map webapp should start on `http://localhost:5173` url
