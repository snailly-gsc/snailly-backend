
# Snailly Backend

[![Nodejs](https://img.shields.io/badge/NodeJs-18-green.svg)](https://NodeJs.com/) [![Typescript](https://img.shields.io/badge/Typescript-lastest-green.svg)](https://www.typescriptlang.org/) [![Postgresql](https://img.shields.io/badge/Postgresql-lastest-green.svg)](https://www.postgresql.org/) 

## How to Install and Run the Project
To install and run the Snailly Backend project locally, please follow these steps:

 1.Clone the repository from GitHub:    
```bash
 git@github.com:snailly-hackfest/snailly-backend.git
 ```

Navigate to the project directory:
```bash
  cd snailly-backend
```

Install the project dependencies using a package manager such as npm or yarn:
```bash
  npm install
```
or
```bash
  yarn install
```
Copy example environment file to new file
```bash
  cp .env.example .env
```

Run Migration and seeder.
```bash
    npm run prisma:migrate 
```

Run the development server.
```bash
  npm run dev
```
Access the website locally at http://localhost:5000.

