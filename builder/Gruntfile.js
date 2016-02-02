
/** Calculating version **/
fs = require('fs')
var versionFile = "./version";
var version = 0;
try {
    version = fs.readFileSync(versionFile, 'utf8');    
} catch (ex) {
    version = 0;
    fs.writeFileSync(versionFile, version, {mode: '0777'});
    fs.chmod(versionFile, '0777');
}
version++;
fs.writeFileSync(versionFile, version, {mode: '0777'});
fs.chmod(versionFile, '0777');

module.exports = function(grunt) {
    var cdn = grunt.option('cdnUrl');
    var baseUrl = grunt.option('baseUrl');
    var txtVersion = "v" + version;

    stringReplaceFiles = {};
    stringReplaceFiles['build/'+ txtVersion +'/index.html'] = 'build/'+ txtVersion +'/index.html';
    var templateReplaceFiles = {};
    templateReplaceFiles['build/'+ txtVersion +'/templates/'] = 'build/'+ txtVersion +'/templates/**';
    console.log(templateReplaceFiles);

    console.log(baseUrl);

    var uglifyFileOption = {
        files: {}
    };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["./build"],
        'string-replace': {
            inline: {
                files: stringReplaceFiles,
                options: {
                    replacements: [
                        {
                            pattern: '<!-- base-url -->',
                            replacement: (function(){
                                if(cdn && cdn.length) {
                                    return '<base href="' + cdn + '/' + txtVersion+ '/"><script type="text/javascript">window.definedCDN = "'+ cdn +'";window.appVersion="'+ txtVersion +'";</script>';
                                }
                                return '';
                            })()
                        },
                        {
                            pattern: 'data-main="scripts',
                            replacement: 'data-main="/' + txtVersion +'/scripts'
                        }
                    ]
                }
            },
            templates: {
                files: templateReplaceFiles,
                options: {
                    replacements: [
                        {
                            pattern: /href=\"\#/g,
                            replacement: 'href="' + baseUrl + '/#'
                        },
                        {
                            pattern: /href=\'\#/g,
                            replacement: 'href=\'' + baseUrl + '/#'
                        },
                    ]
                }
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
                    dest: './build/' + txtVersion
                }]
            }
        },
        uglify: {
            min: uglifyFileOption
        }
    });
    // Production Build Tools
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.task.registerTask('delayed-uglify', 'Delaying Uglify', function() {
        var done = this.async();
        uglifyFileOption["files"] = grunt.file.expandMapping([
            './build/'+ txtVersion +'/**/*.js'
        ],
        '', {
            rename: function(destBase, destPath) {
                return destBase + destPath;
            }
        });
        fs.renameSync('build/'+ txtVersion +'/index.html', 'build/index.html')
        setTimeout(function(){
            done();
        },1000);
    });
    // Project configuration.
    grunt.registerTask('default', ['copy', 'string-replace', 'delayed-uglify', 'uglify']);
};
