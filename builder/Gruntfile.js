module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["./build"],
        uglify: {
            options: {
                //mangle: false
            },
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
                files: [{
                    expand: true,
                    cwd: '../',
                    src: ['**', '!**/builder/**'],
                    dest: './build'
                }]
            }
        }
    });
    // Production Build Tools
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Project configuration.
    grunt.registerTask('default', ['clean', 'copy', 'uglify']);
};
