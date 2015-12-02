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
        jshint: {
            jsFiles: files.js,
            options: {
                node: false
            }
        },
        jsbeautifier: {
            jsFiles: files.js,
            options: {
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-openfin');

    grunt.registerTask('default', ['jshint', 'jsbeautifier']);
    grunt.registerTask('test', ['jshint', 'jsbeautifier']);
    grunt.registerTask('serve', ['test', 'connect:livereload', 'openfin:serve', 'watch']);
    grunt.registerTask('build', ['test', 'openfin:build']);

};
