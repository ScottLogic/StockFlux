/* jshint node: true*/
'use strict';
module.exports = function(grunt) {
    var target = grunt.option('target') || 'http://localhost:5000',
        port = process.env.PORT || 5000,
        buildTarget = grunt.option('build-target') || 'dev';

    grunt.initConfig({

        connect: {
            options: {
                port: port,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: false,
                    base: ['public']
                }
            }
        },

        openfin: {
            options: {
                configPath: target + '/app.json',
                config: {
                    create: false,
                    filePath: 'public/app.json',
                    options: {
                        startup_app: {
                            url: target + '/parent.html',
                            applicationIcon: target + '/favicon.ico'
                        },
                        shortcut: {
                            icon: target + '/favicon.ico'
                        },
                        splashScreenImage: target + '/assets/png/splashscreen.png'
                    }
                }
            },
            serve: {
                open: true
            },
            build: {
                open: false
            }
        },

        less: {
            development: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'style.css.map',
                    sourceMapFilename: 'public/assets/css/style.css.map'
                },
                files: {
                    'public/assets/css/style.css': 'src/assets/styles/style.less'
                }
            },
            production: {
                options: {
                    strictMath: true
                },
                files: {
                    'public/assets/css/style.css': 'src/assets/styles/style.less'
                }
            }
        },

        download: {
            //One zip for release type (development/master) and one for the version are created here
            openfinZip: {
                src: ['https://dl.openfin.co/services/download?fileName=StockFlux-' + buildTarget +
                '&config=http://scottlogic.github.io/StockFlux/' + buildTarget + '/app.json'],
                dest: './public/StockFlux-' + buildTarget + '.zip'
            }
        },

        eslint: {
            target: ['src/**/*.js']
        },

        clean: {
            dist: {
                src: ['public', 'node_modules/BitFlux/dist']
            }
        },

        copy: {
            modulescss: {
                expand: true,
                cwd: 'node_modules/',
                src: ['d3fc/dist/d3fc.min.css',
                    'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css'],
                dest: 'public/assets/css/',
                flatten: true
            },
            modulesjs: {
                expand: true,
                cwd: 'node_modules/',
                src: [
                    'jquery/dist/jquery.min.js',
                    'angular/angular.min.js',
                    'angular-resource/angular-resource.min.js',
                    'moment/min/moment.min.js',
                    'angular-animate/angular-animate.min.js',
                    'angular-storage/dist/angular-storage.min.js',
                    'd3fc/dist/d3fc.bundle.min.js',
                    'BitFlux/node_modules/bootstrap/js/dropdown.js',
                    'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js'
                ],
                dest: 'public/assets/js/',
                flatten: true
            },
            showcase: {
                expand: true,
                cwd: 'node_modules/BitFlux/dist/',
                src: ['**'],
                dest: 'public/',
                rename: function(dest, src) {
                    if (src.split('.').pop() === 'html') {
                        return dest + 'BitFlux.html';
                    }

                    return dest + src;
                }
            },
            html: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.html'],
                dest: 'public'
            },
            json: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.json'],
                dest: 'public'
            },
            icons: {
                expand: true,
                cwd: 'src/',
                src: ['assets/png/*.png', 'favicon.ico'],
                dest: 'public'
            },
            fonts: {
                files: [{
                    expand: true,
                    cwd: 'node_modules/BitFlux/node_modules/bootstrap/dist/fonts/',
                    src: ['**'],
                    dest: 'public/assets/fonts'
                }]
            }
        },
        concat: {
            dist: {
                src: ['src/**/*.js', '!src/parent-controller.js',
                      '!src/parentApp.js', '!src/window-service.js'],
                dest: 'public/app.js'
            },
            parent: {
                src: ['src/parentApp.js', 'src/parent-controller.js', 'src/store-service.js',
                    'src/window-service.js', 'src/sidebars/favourites/geometry-service.js',
                    'src/config-service.js', 'src/version-value.js'],
                dest: 'public/app-parent.js'
            }
        },

        uglify: {
            dist: {
                files: {
                    'public/app.js': ['public/app.js']
                }
            }
        },
        babel: {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                    'public/app.js': 'public/app.js',
                    'public/app-parent.js': 'public/app-parent.js'
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'src/version-value.js'],
                commit: true,
                commitMessage: 'Release %VERSION%',
                commitFiles: ['package.json', 'src/version-value.js'],
                createTag: false,
                push: false,
                prereleaseName: 'rc'
            }
        },

        'string-replace': {
            inline: {
                files: {
                    'public/app.js': 'public/app.js',
                    'public/app-parent.js': 'public/app-parent.js'
                },
                options: {
                    replacements: [{
                        pattern: 'const allowContextMenu = true;',
                        replacement: 'const allowContextMenu = false;'
                    }, {
                        pattern: 'API_KEY = \'kM9Z9aEULVDD7svZ4A8B\'',
                        replacement: 'API_KEY = \'SmMCEZxMRoNizToppows\''
                    }]
                }
            },
            'gh-pages': {
                files: {
                    'public/app.json': 'public/app.json'
                },
                options: {
                    replacements: [{
                        pattern: new RegExp('http://scottlogic.github.io/StockFlux/([A-z]+)/', 'g'),
                        replacement: 'http://scottlogic.github.io/StockFlux/' + buildTarget + '/'
                    }]
                }
            }
        }
    });

    var isWin = (/^win/).test(process.platform);

    grunt.loadNpmTasks('grunt-contrib-connect');
    if (isWin) {
        grunt.loadNpmTasks('grunt-openfin');
    }
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-http-download');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('showcase', function() {
        var callback = this.async();
        grunt.util.spawn({
            grunt: true,
            args: ['build:module'],
            opts: {
                cwd: 'node_modules/BitFlux/'
            }
        }, function(error, result, code) {
            console.log(result.stdout);
            callback();
        });
    });

    grunt.registerTask('concatenate', ['eslint', 'clean', 'showcase', 'copy', 'concat'])
    grunt.registerTask('transpile', ['babel', 'less:development']);

    grunt.registerTask('build:dev', ['concatenate', 'transpile', 'connect:livereload']);
    grunt.registerTask('build:release', ['concatenate', 'string-replace', 'transpile', 'uglify', 'connect:livereload']);

    grunt.registerTask('serve', ['build:dev', 'openfin:serve']);
    grunt.registerTask('default', ['serve']);

    grunt.registerTask('release', ['bump:major']);

    grunt.registerTask('ci', ['build:release', 'download']);

};
