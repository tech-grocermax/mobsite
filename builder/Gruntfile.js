module.exports = function(grunt) {
    var cdn = grunt.option('cdn');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["./build"],
        'string-replace': {
            inline: {
                files: {
                    'build/index.html': 'build/index.html',
                },
                options: {
                    replacements: [
                        {
                            pattern: '<!-- base-url -->',
                            replacement: (function(){
                                if(cdn && cdn.length) {
                                    return '<base href="' + cdn + '"><script type="text/javascript">window.definedCDN = "'+ cdn +'";</script>';
                                }
                                return '';
                            })()
                        }
                    ]
                }
            }
        },
        uglify: {
            min: {
                files: grunt.file.expandMapping([
                        './build/**/*.js',
                        // './build/scripts/apps/controllers/**/*.js',
                        // './build/scripts/apps/directives/**/*.js',
                        // './build/scripts/apps/filter/**/*.js',
                        // './build/scripts/apps/services/**/*.js'
                    ],
                    './', {
                        rename: function(destBase, destPath) {
                            return destBase + destPath;
                        }
                    })
            }
        },
        copy: {
            production: {
                options: {
                    dot: true
                },
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '../',
                    src: ['**', '!**/builder/**', '!**/.git/**', '!**/.git**'],
                    dest: './build'
                }]
            }
        }
    });
    // Production Build Tools
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Project configuration.
    grunt.registerTask('default', ['clean', 'copy', 'string-replace','uglify']);
};
