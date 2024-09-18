# Todo List Monorepo

This project is an end-to-end web application that allows the user to read,
create and update a to-do list of duties.

Technical Stack:

- Frontend framework: React + Typescript
- Layout: Tailwind Fortawesome
- Form validation: React Hook Form + Yup
- Backend framework: Express + Typescript
- Database: PostgreSQL
- Unit test: Jest + Supertest
- Build tool / monorepo: pnpm + nx

## Run tasks

Install `pnpm` globally

```
npm install -g pnpm
```

Install node packages

```
pnpm install
```

Start frontend in development environment

```
pnpm run web
```

Setup PostgreSQL database and import mock data

```
# setup database with mock data (recommend)
pnpm run db:mock

# setup database without data (skip if already run db:mock)
pnpm run db:setup

# clear all tables and data
pnpm run db:drop
```

Start backend in development environment

```
pnpm run server
```

Backend unit test

```
pnpm run test:server
```

Build web project

```
# Remind that do the following step before build
# - create the environment file in env folder
# - update the build command in package.json

pnpm run build:web
```

Build server project

```
# Remind that do the following step before build
# - create the environment file in env folder
# - update the build command in package.json

pnpm run build:server
```
