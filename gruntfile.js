/* jshint node: true*/
'use strict';
module.exports = function(grunt) {
    var target = grunt.option('target') || 'http://scottlogic.github.io/bitflux-openfin',
        port = process.env.PORT || 5000;

    grunt.initConfig({
        'gh-pages': {
            origin: {
                options: {
                    base: 'public',
                    message: 'Deploy to GitHub Pages'
                },
                src: ['**/*']
            },
            upstream: {
                options: {
                    base: 'public',
                    message: 'Deploy to GitHub Pages',
                    repo: 'https://github.com/ScottLogic/bitflux-openfin.git'
                },
                src: ['**/*']
            }
        },

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
                        }
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
            openfinZip: {
                src: ['https://dl.openfin.co/services/download?fileName=bitflux-openfin&config=http://scottlogic.github.io/bitflux-openfin/app.json'],
                dest: './public/bitflux-openfin.zip'
            }
        },

        eslint: {
            target: ['src/**/*.js']
        },

        clean: {
            dist: {
                src: ['public', 'node_modules/d3fc-showcase/dist']
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
                    'd3fc-showcase/node_modules/bootstrap/js/dropdown.js',
                    'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js'
                ],
                dest: 'public/assets/js/',
                flatten: true
            },
            showcase: {
                expand: true,
                cwd: 'node_modules/d3fc-showcase/dist/',
                src: ['**'],
                dest: 'public/',
                rename: function(dest, src) {
                    if (src.split('.').pop() === 'html') {
                        return dest + 'd3fc-showcase.html';
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
                src: ['**/*.svg', '**/*.ico'],
                dest: 'public'
            },
            fonts: {
                files: [{
                    expand: true,
                    cwd: 'node_modules/d3fc-showcase/node_modules/bootstrap/dist/fonts/',
                    src: ['**'],
                    dest: 'public/assets/fonts'
                }]
            }
        },
        concat: {
            dist: {
                src: ['src/**/*.js'],
                dest: 'public/app.js'
            },
            parent: {
                src: ['src/parentApp.js', 'src/parent-controller.js', 'src/store-service.js', 'src/window-service.js', 'src/sidebars/favourites/geometry-service.js'],
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
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('showcase', function() {
        var callback = this.async();
        grunt.util.spawn({
            grunt: true,
            args: ['build:module'],
            opts: {
                cwd: 'node_modules/d3fc-showcase/'
            }
        }, function(error, result, code) {
            console.log(result.stdout);
            callback();
        });
    });

    grunt.registerTask('build', ['eslint', 'clean', 'showcase', 'copy', 'concat', 'babel', 'less:development', 'connect:livereload']);
    grunt.registerTask('build:uglify', ['build', 'uglify']);
    grunt.registerTask('serve', ['build', 'openfin:serve']);
    grunt.registerTask('createZip', ['build:uglify', 'download']);
    grunt.registerTask('ci', ['build:uglify', 'download']);
    grunt.registerTask('deploy', ['ci', 'gh-pages:origin']);
    grunt.registerTask('deploy:upstream', ['ci', 'gh-pages:upstream']);
    grunt.registerTask('default', ['serve']);
};
