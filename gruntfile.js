/* jshint node: true*/
'use strict';
module.exports = function(grunt) {
    var target = grunt.option('target') || 'http://localhost:5000',
        port = process.env.PORT || 5000,
        files = {
            js: [
                'gruntfile.js',
                'src/**/*.js',
                'src/**/*.json',
                '*.json'
            ],
            html: [
                'src/**/*.html'
            ],
            css: [
                'src/**/*.css',
                'src/**/*.less'
            ],
            showcase: [
                'node_modules/d3fc-showcase/dist/'
            ]
        };

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

        download: {
            openfinZip: {
                src: ['https://dl.openfin.co/services/download?fileName=OpenFinD3FC&config=http://owennw.github.io/OpenFinD3FC/app.json'],
                dest: './public/OpenFinD3FC.zip'
            }
        },

        eslint: {
            target: ['src/**.js']
        },

        clean: {
            dist: {
                src: ['public', 'node_modules/d3fc-showcase/dist']
            }
        },

        copy: {
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
            js: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.js', '**/*.json'],
                dest: 'public'
            },
            icons: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.svg', '**/*.ico'],
                dest: 'public'
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
    });

    grunt.registerTask('build', ['eslint', 'clean', 'showcase', 'copy', 'less:development', 'connect:livereload']);
    grunt.registerTask('serve', ['build', 'openfin:serve']);
    grunt.registerTask('createZip', ['build', 'download']);
    grunt.registerTask('ci', ['build', 'download']);
    grunt.registerTask('deploy', ['ci', 'gh-pages:origin']);
    grunt.registerTask('deploy:upstream', ['ci', 'gh-pages:upstream']);
    grunt.registerTask('default', ['serve']);
};
