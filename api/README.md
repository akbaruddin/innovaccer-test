# Backend Application

# Frontend Application


### Run Projects

[localhost:8080](localhost:8080)

Install Packages
```bash
yarn 

# or

npm install
```

Run
```bash
yarn start

# or

npm run start
```

Also change/update mongo URL in `.env` or run `docker mongo` for DB

### Run Project in Docker

[localhost:8080](localhost:8080) or [IP or Domain name]()

Rename `.env.local` -> `.env`, or Create New with custom values.

Build
```bash
docker-compose build

# prod
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Run
```bash
docker-compose up -d
```

### DB

Create DB `patients` and Collection `patients`
