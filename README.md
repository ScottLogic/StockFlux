# StockFlux

StockFlux is an implementation of a desktop app using Openfin, written using [AngularJS](https://angularjs.org/). It pulls data from [Quandl](https://www.quandl.com/), and displays it using [BitFlux](http://scottlogic.github.io/BitFlux/). You can search for new stocks, add stocks to favourites, and tear out stocks (similar to browser tabs). You can also collapse the window into a compact view.

![Image of StockFlux](https://cloud.githubusercontent.com/assets/7962948/13354652/5a48e678-dc94-11e5-9e29-51a076cd3b28.PNG)

## Installing

You can download StockFlux from [here](http://scottlogic.github.io/StockFlux/stockflux.zip). If you haven't already installed an OpenFin application, this will install the OpenFin runtime. It'll also add shortcuts to StockFlux to your desktop and start menu.

Each application start up, it downloads the application from Github Pages, meaning that it will automatically update and that it cannot be used offline.

## Developing

[npm](https://www.npmjs.com/), the package manager for [Node.js](https://nodejs.org/), is used to manage the project's dependencies. [Grunt](http://gruntjs.com/), a JavaScript task runner, is used to test and build the project.

### Initial Setup

- Download or clone this repository locally
- Ensure [Node.js](https://nodejs.org/), which includes npm, is installed
- Ensure [Grunt](http://gruntjs.com/getting-started#installing-the-cli) is installed:

```
npm install -g grunt-cli
```

- Navigate to the root of your local copy of this project and install the dependencies:

```
npm install
```

- Perform an initial build:

```
grunt build
```

#### Running locally

To run in an OpenFin shell run the grunt task

```
grunt serve
```

The project is also accessible at http://localhost:5000


## License

This project is licensed under the [MIT License](http://opensource.org/licenses/MIT).
