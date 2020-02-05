module.exports = function(grunt) {

    grunt.initConfig({

        concat: {
            dist: {
                src: ['src/single.js', 'src/es6-export.js'],
                dest: 'dist/single-es6.min.js'
            },
        },

        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! single.js <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/single.min.js': ['src/single.js'],
                    'dist/single-es6.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        cssmin: {
            option: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/single.min.css': ['src/single.css']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};