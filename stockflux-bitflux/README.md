# [BitFlux](http://scottlogic.github.io/BitFlux/)

**A cross-platform financial charting application to showcase the functionality of [d3fc](https://d3fc.io) components.**

Visit [the website](http://scottlogic.github.io/BitFlux/) to view the application.


| Version                                                                   | Build status                                                                                                             | View                                                                                         |
|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| [Latest release](https://github.com/ScottLogic/BitFlux/releases) (Master) | [![Build Status](https://travis-ci.org/ScottLogic/BitFlux.svg?branch=master)](https://travis-ci.org/ScottLogic/BitFlux)  | [http://scottlogic.github.io/BitFlux/master/](http://scottlogic.github.io/BitFlux/master/)   |
| Development                                                               | [![Build Status](https://travis-ci.org/ScottLogic/BitFlux.svg?branch=develop)](https://travis-ci.org/ScottLogic/BitFlux) | [http://scottlogic.github.io/BitFlux/develop/](http://scottlogic.github.io/BitFlux/develop/) |

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
grunt
```

### Running

#### Local server

To run on local server, run the grunt task:

```
grunt serve
```

The project is then accessible at http://localhost:PORTNUMBER

#### GitHub Pages

For this option to be available, you should have forked the ScottLogic/BitFlux repository to your GitHub account.

To run on GitHub Pages, run the grunt command:

```
grunt deploy
```

The project is then accessible at the obvious address (USERNAME.github.io/REPO-NAME).

### Development

To run a development build on a local server, run the grunt task:

```
grunt dev
```

The project is then accessible at http://localhost:PORTNUMBER

This will also start a watch task on the repository, and cause grunt to rebuild and reload the project once any file is changed.

### Testing

To run the unit tests, run the grunt command:

```
grunt test
```

To generate a code coverage report, run

```
grunt test:coverage
```

## License

This project is licensed under the [MIT License](http://opensource.org/licenses/MIT).
