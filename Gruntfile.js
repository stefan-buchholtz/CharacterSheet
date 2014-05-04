module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		shell: {
			dist: {
				command: [
					'rm -r build',
					'mkdir build',
					'cp -r server server.js build/',
					'mkdir build/client',
					'cp -r client/images build/client/'
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
				src: ['build/tmp/bower.js', 'client/js/**/*.js'],
				dest: 'build/client/js/application.js'
			}
		},
		uglify: {
			options: {
				banner: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				sourceMap: true
			},
			dist: {
				files: {
					'build/client/js/application.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		htmlrefs: {
			dist: {
				expand: true,
				src: 'client/**/*.html',
				dest: 'build/'
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					conservativeCollapse: true
				},
				expand: true,
				cwd: 'build',
				src: ['**/*.html'],
				dest: 'build/'
			}
		},
		cssmin: {
			combine: {
				files: {
					'build/client/css/styles.min.css': ['client/stylesheets/base.css', 'client/stylesheets/skeleton.css', 'client/stylesheets/layout.css'],
				}
			}
		},
		jshint: {
			files: ['**/*.js', ]
		}
	});
	
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-htmlrefs');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('dist', ['shell:dist', 'htmlrefs', 'bower_concat', 'concat', 'uglify', 'cssmin']);
}