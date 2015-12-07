/* jshint node: true*/
'use strict';
module.exports = function(grunt) {
    var target = grunt.option('target') || 'http://localhost:5000',
        port = process.env.PORT || 5000,
        files = {
            js: [
                'gruntfile.js',
                'public/**/*.js',
                'public/**/*.json',
                '*.json'
            ],
            html: [
                'public/**/*.html'
            ],
            css: [
                'public/**/*.css'
            ],
            showcase: [
                'node_modules/d3fc-showcase/dist/'
            ]
        };

    grunt.initConfig({
        watch: {
            code: {
                files: [].concat(files.html, files.css, files.js),
                tasks: ['default'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        'public'
                    ]
                },
                files: [].concat(files.html, files.css, files.js)
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
                    base: [
                        'public'
                    ]
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
                            url: target + '/index.html',
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
        copy: {
            main: {
                files: [
                  {
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
                ],
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-openfin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('showcase', function() {
        var callback = this.async();
        grunt.util.spawn({
            grunt: true,
            args: ['build'],
            opts: {
                cwd: 'node_modules/d3fc-showcase/'
            }
        }, function(error, result, code) {
            console.log(result.stdout);
            callback();
        });

        grunt.task.run('copy');
    });

    grunt.registerTask('serve', ['showcase', 'less:development', 'connect:livereload', 'openfin:serve', 'watch']);
    grunt.registerTask('build', ['openfin:build', 'showcase']);
};
