'use strict';

module.exports = function(grunt) {

	var beautifyFiles = ['!Gruntfile.js', '!npm-shrinkwrap.json', 'src/**/*.{html,js}', '!app/bower_components/**/*'];

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    connect: {
             server: {
               options: {
                 port: 9000
               }
             }
    },

    watch: {
           scripts: {
                    files: ['src/**/*'],
                    tasks: ['build'],
                    options: {
                             spawn: false
                    }
           }

    },

    sass: {
      dist: {
        files: {
          'src/angular-ui-view-spinner.css':'src/angular-ui-view-spinner.scss'
        }
      }
    },

    // verifies we have formatted our js and HTML according to our style conventions
	  jsbeautifier: {
		  verify : {
			  src:   beautifyFiles,
			  options: {
				  config: '.jsbeautifyrc',
				  mode: 'VERIFY_ONLY'
			  }
		  },
		  update: {
			  src:   beautifyFiles,
			  options: {
				  config: '.jsbeautifyrc'
			  }
		  }
	  },


    // Make sure code styles are up to par and there are no obvious mistakes
    jshint:       {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      src:     ['src/!(*spec).js']
    },

    // Test settings
    karma:        {
      unit: {
        options:    {
          logLevel: 'DEBUG'
        },
        browsers:   ['PhantomJS'],
        configFile: 'karma.conf.js',
        singleRun:  true,
        autoWatch:  false
      }
    },
    coveralls: {
      options: {
        coverage_dir:'coverage',
        directory:'coverage/PhantomJS 1.9.7 (Mac OS X)/lcov.info',
        debug: true,
        dryRun: false,
        recursive: false
      }
    }
  });

  grunt.registerTask('serve', ['build','connect', 'watch']);
	grunt.registerTask('beautify', ['jsbeautifier:update']);

	grunt.registerTask('build', [
     'sass', 'jsbeautifier:verify', 'jshint', 'karma'
  ]);

  grunt.registerTask('default', [
    'build',
    'coveralls'
  ]);

	grunt.registerTask('serve', ['connect', 'watch']);
	grunt.registerTask('beautify', ['jsbeautifier:update']);
	grunt.registerTask('default', [
		'jsbeautifier:verify', 'jshint', 'karma', 'coveralls'
	]);

};
