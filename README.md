# BitFlux-OpenFin

Using OpenFin this will be a locally hosted financial charting application, pulling data from [Quandl](https://www.quandl.com/) and viewing it using the [BitFlux](http://scottlogic.github.io/BitFlux/).

You can download the OpenFin demo from [here](http://scottlogic.github.io/bitflux-openfin/bitflux-openfin.zip).

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

### Running

#### Local OpenFin

To run in an OpenFin shell run the grunt task

```
grunt serve
```

The project is also accessible at http://localhost:5000
 
To package the application into an OpenFin exe run the task

```
grunt createZip
```

This will create a zip file for the OpenFinD3FC.exe, which can then be run locally in production.


## License

This project is licensed under the [MIT License](http://opensource.org/licenses/MIT).
