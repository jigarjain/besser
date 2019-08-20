# Besser

A simple & easy to use A/B testing engine for Node written in Typescript. This is the core engine which exposes API endpoints for other wrappers to integrate with. The goal of this project is to provide an isomorphic way of running A/B tests where an A/B test can be activated/triggered on server side while the goals can be captured on the client side.


### Requirements
- Node >=12.7.0
- Docker


### Stack
- [Express](https://expressjs.com/) as routing framework
- [Typescript](https://www.typescriptlang.org/) as programming language
- [Postgres](https://www.postgresql.org/) as Database
- [Jest](https://jestjs.io/) as testing framework


### Download the code
First, we must download the code using git.
```sh
git clone https://github.com/jigarjain/besser.git
```


### Setting Up Database
Before we start the project, we need to have the Postgres database up & running. For ease of development, this project ships with a [docker-compose](https://docs.docker.com/compose/) file which will setup the Postgres for you. Assuming you have the Docker installed, run the below command to setup Postgres

```sh
cd besser
docker-compose up -d
```

Once we the Postgres docker container (besser_postgres) running, we will create 2 database for our development. To do so, we must first connect to the above container
```sh
docker exec -it besser_postgres bash
```
Once we are inside the container, we can connect to the postgres by running the below command
```sh
psql -U postgres
psql (10.3 (Debian 10.3-1.pgdg90+1))
Type "help" for help.
```

Now that we have access to postgres, we will go ahead & create 2 databases for development & for testing respectively

```sh
postgres=# CREATE DATABASE besser;
CREATE DATABASE
postgres=# CREATE DATABASE test_besser;
CREATE DATABASE
```
Once done, we can exit the shell as we have successfully setup the DB.

> You may also choose to skip Docker & use existing Postgres installation. In that case, you must still create the 2 databases (namely `besser` & `test_besser`) & update the .env file as mentioned in this [configuration section](#setting-up-configuration)


### Installing code
As with every node project, we install the dependencies first
```sh
npm install
```


### Setting up configuration
This project read the configuration from environment variables. The default values can be found in `.env.sample` file. We will create a copy of this file as `.env`. During bootup [dotenv](https://www.npmjs.com/package/dotenv) will read this file & sets up the values in `process,env` variable which will be consumed by the application.
```sh
cp .env.sample .env
```
> Feel free to modify this configuration values in this newly created file as per your setup. If you have different database setup, you will need to update those here. Note that this file must not be checked into git. Please read the [12factor App Methodology](https://12factor.net/config) to understand why.


### Running Database Migrations
Once we have created the database & have setup the correct configuration as mentioned in previous steps, we can now proceed ahead with creating table schemas. The table schemas can be found under the folder called `/migrations`. We use [knex](http://knexjs.org) as query building & migration tool in this application. To run the migration, we simply run the below command
```sh
npm run migrate-db
```


### Compiling Typescript to JS
This application is written in Typescript. But as Node can only execute Javasript, we will first compile all the typescript files from './src' folder into `./dist` by running
```sh
npm run build
```


### Running the application
Now that we have compiled the source files into Javascript from TS, we start the node server by simply running the below command
```sh
npm serve
```


## Development
This section will be useful if you plan to do development on this code.


### NPM Scripts
First, you will need to be aware of the various build steps & their purpose. All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts). Npm scripts basically allow us to call (and chain) terminal commands via npm. To call a script, simply run `npm run <script-name>` from the command line.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `build`             | Compiles all source `.ts` files to `.js` files in the `dist` folder |
|`serve `             | Runs the server from `dist` as `node dist/server.js` which is app's entry point |
| `start`             | Runs both `build` & `serve` commands |
| `test`              | Runs tests using Jest test runner |
|`test-coverage`      | Runs test but also collects coverage report |
| `watch-build`       | Runs the `build` command in watch mode |
| `watch-serve`       | Runs the `serve` command in watch mode. It uses `nodemon` & will restart the server if it crashes or any `.js` files updates |
| `watch-ts`          | Runs the test command in watch mode |
| `watch`             | Concurrently runs both `watch-build` & `watch-serve`. This is the command you will mostly use during development |
|`migrate-db`         | Runs all the migrations from the `./migration` folder' |

During development, you will mostly `npm run watch` & `npm run test`


### Testing
WIP


### Code Style Checks
WIP



### License
Licensed under the [MIT](LICENSE.txt) License.
