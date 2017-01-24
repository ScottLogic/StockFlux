# StockFlux

StockFlux is a desktop application developed by [Scott Logic](http://www.scottlogic.com/) that uses the OpenFin HTML5 container.

![Image of StockFlux](https://cloud.githubusercontent.com/assets/1098110/13568013/a02e0fc8-e456-11e5-9543-4642a54c3e2a.png)

Here are a few things to try:
  - Add and remove stocks via the search pane
  - Drag tiles within the favourites pane to re-order them
  - Drag a tile outside of the favourites pane to create a new application window
  - Re-open recent windows via the icon at the bottom right of the favourites pane
  - Use the icon on the top right of the title bar to toggle 'collapsed' mode

## Installing

In order to install the application, download [StockFlux installer zipfile](https://dl.openfin.co/services/download?fileName=StockFlux-master&config=http://scottlogic.github.io/StockFlux/master/app.json), unzip and run the executable. If you haven't already installed an OpenFin application, this will install the required runtime. It'll also add shortcuts to StockFlux to your desktop and start menu.

This is an 'evergreen' application, each time it launches the application code is downloaded (from GitHub pages), ensuring that it is always up-to-date.

# Development

The application is built using React and ES2015, transpiled via Babel. The charts are rendered using [d3fc](https://d3fc.io/), a Scott Logic open source project which provides a number of components that allow the creation of bespoke interactive charts. The bulk of the charting code is adapted from [BitFlux](http://scottlogic.github.io/BitFlux/), which showcases the capabilities of d3fc.

The displayed data is real and provided by [Quandl](https://www.quandl.com). The application uses separate Quandl API keys for development and release to mitigate chances of crossing Quandl's [rate limits](https://www.quandl.com/docs/api?json#rate-limits).

### Initial Setup

[npm](https://www.npmjs.com/), the package manager for [Node.js](https://nodejs.org/), is used to manage the project's dependencies. [Grunt](http://gruntjs.com/), a JavaScript task runner, is used to test and build the project.

- Download or clone this repository locally
- Ensure [Node.js](https://nodejs.org/), which includes npm, is installed


Install dependencies:

```
npm install
```

Start the webpack development server:

```
npm start
```

Start the remote redux dev tools server:

```
npm run remotedev
```
Navigate to `http://localhost:8000` or use the [redux devtools extension](https://github.com/zalmoxisus/redux-devtools-extension) to inspect and dispatch actions.

Launch the OpenFin runtime:

```
npm run openfin:dev
```

### npm Build Tasks

#### Development Build

Run webpack-dev-server with the development config: `npm start`

Launch OpenFin with the development setup (requires the dev server to be running): `npm run openfin:dev`

#### Production Build

Build and serve the production bundle: `npm run prod`

Launch OpenFin with the production setup (requires the server to be running): `npm run openfin:prod`

### Testing

There is a [test plan](docs/TEST_PLAN.md) that covers the main features and behaviour. This should be used as a basis for testing before releasing and also the main features covered on testing PR changes.

#### npm Tasks

Run the full suite of unit tests: `npm test`

Lint and run the tests: `npm run ci`

Run the tests once initially and on any subsequent changes to JavaScript files: `npm run test:watch`

Get details on the test coverage: `npm run test:cov`

### Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details of how to contribute.

## License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
