module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var path = require('path');
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pkgMeta: grunt.file.readJSON('config/meta.json'),
    dest: grunt.option('target') || 'dist',
    basePath: path.join('<%= dest %>', 'App_Plugins', '<%= pkgMeta.name %>'),
    
    watch: {
      options: {
        spawn: false,
        atBegin: true
      },
      dll: {
        files: ['/RankOne.SEO.Tool/**/*.dll'],
        tasks: ['copy:dll']
      }
    },

    copy: {
      dll: {
        cwd: 'src/RankOne.SEO.Tool/bin/Release/',
        src: '*.dll',
        dest: '<%= dest %>/bin/',
        expand: true
      },
	  debug: {
        cwd: 'src/RankOne.SEO.Tool/bin/Debug/',
        src: ['*.dll', '*.pdb'],
        dest: '<%= dest %>/bin/',
        expand: true
      },
	  plugin:{
		cwd: 'src/RankOne.SEO.Tool/Web/UI/App_Plugins/RankOne/',
        src: ["*.*", "**/*.*"],
        dest: '<%= basePath %>',
        expand: true	
	  }
    },

	touch: {
      webconfig: {
        src: ['<%= grunt.option("target") %>\\Web.config']
      }
    },
	
    msbuild: {
      options: {
        stdout: true,
        verbosity: 'quiet',
        maxCpuCount: 4,
        version: 4.0,
        buildParameters: {
          WarningLevel: 2,
          NoWarn: 1607
        }
      },
      dist: {
        src: ['src/RankOne.SEO.Tool/RankOne.csproj'],
        options: {
          projectConfiguration: 'Release',
          targets: ['Clean', 'Rebuild'],
        }
      },
      dev: {
        src: ['src/RankOne.SEO.Tool/RankOne.csproj'],
        options: {
          projectConfiguration: 'Debug',
          targets: ['Clean', 'Rebuild'],
        }
      }
    }
  });

  grunt.registerTask('default', ['msbuild:dist', 'copy:dll', 'copy:plugin']);
  grunt.registerTask('develop', ['msbuild:dev', 'copy:debug', 'copy:plugin']);
};