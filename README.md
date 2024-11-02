## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (for containerization)
- [Docker Compose](https://docs.docker.com/compose/install/) (for managing multi-container Docker applications)
- [Node.js V18](https://nodejs.org/en/download/) (for the React frontend)
- [NVM](https://github.com/nvm-sh/nvm) (for managing Node.js versions, optional but recommended)
- [.NET SDK V8](https://dotnet.microsoft.com/download) (for the .NET backend)

## Start with

`cd frontend` & `npm install`

## When developing for frontend

I would recommend just using `npm run dev` for and live changes
My understanding is that only when you need communications with backend etc. you need to use the following:

## Running fullstack app using:

`docker-compose up --build`

### Or to abort if one image fails:

`docker-compose up --build --abort-on-container-exit`

### Ad -d flag if want to run in background

`docker-compose up --build --abort-on-container-exit -d`

## Manually run tests for backend with

`dotnet test`

## Manually run tests for frontend with

`npm test` or `npm vitest`
