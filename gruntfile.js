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
                    repo: 'https://github.com/owennw/OpenFinD3FC.git'
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
        download: {
            openfinZip: {
                src: ['https://dl.openfin.co/services/download?fileName=OpenFinD3FC&config=http://owennw.github.io/OpenFinD3FC/app.json'],
                dest: './public/OpenFinD3FC.zip'
            }
        },
        copy: {
            main: {
                files: [
                  {
                      expand: true,
                      cwd: 'node_modules/d3fc-showcase/dist/',
                      src: ['**'],
                      dest: 'public/'
                  }
                ]
            }
        }
    });

    var isWin = (/^win/).test(process.platform);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    if (isWin) {
        grunt.loadNpmTasks('grunt-openfin');
    }
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-http-download');
    grunt.loadNpmTasks('grunt-gh-pages');

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

    grunt.registerTask('build', ['showcase', 'connect:livereload']);
    grunt.registerTask('serve', ['build', 'openfin:serve', 'watch']);
    grunt.registerTask('createZip', ['build', 'download']);
    grunt.registerTask('ci', ['showcase', 'connect:livereload', 'download']);
    grunt.registerTask('deploy', ['ci', 'gh-pages:origin']);
    grunt.registerTask('deploy:upstream', ['ci', 'gh-pages:upstream']);
};
