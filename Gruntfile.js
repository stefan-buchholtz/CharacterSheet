module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		shell: {
			dist: {
				command: [
					'rm -r build',
					'mkdir build',
					'cp -r api config database services app.js config.js server.js database.js build/',
					'mkdir build/app',
					'cp -r app/images build/app/'
				].join('; ')
			},
			cleanup: {
				command: 'rm -r build/tmp'
			}
		},
		bower_concat: {
			dist: {
				dest: 'build/tmp/bower.js'
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			
			dist: {
				src: ['build/tmp/bower.js', 'app/js/**/*.js'],
				dest: 'build/app/js/application.js'
			}
		},
		uglify: {
			options: {
				banner: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				sourceMap: true
			},
			dist: {
				files: {
					'build/app/js/application.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		htmlrefs: {
			dist: {
				expand: true,
				src: 'app/**/*.html',
				dest: 'build/'
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: 'build/app**/*.html'
			}
		},
		cssmin: {
			combine: {
				files: {
					'build/app/css/styles.min.css': ['app/stylesheets/base.css', 'app/stylesheets/skeleton.css', 'app/stylesheets/layout.css'],
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-htmlrefs');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	grunt.registerTask('dist', ['shell:dist', 'htmlrefs', 'htmlmin', 'bower_concat', 'concat', 'uglify', 'cssmin']);
}