'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        'files': {
          'game.js': 'game-es6.js'
        }
      }
    },
    jshint: {
      'options': {
        'jshintrc': '.jshintrc'
      },
      'all': [
        'Gruntfile.js',
        'game-es6.js'
      ]
    },
    watch: {
      'grunt': {
        'files': ['Gruntfile.js'],
        'tasks': [
          //'jshint'
        ]
      },
      'babel': {
        'files': 'game-es6.js',
        'tasks': ['babel']
      },
      'livereload': {
        'files': [
          '*.js',
        ],
        'options': {
          'livereload': true
        }
      }
    },
    connect: {
      'dist': {
        'options': {
          'port': 9001,
          'base': '',
          'open': true,
          'keepalive': false,
          'livereload': true,
          'hostname': '127.0.0.1'
        }
      }
    }
  });
  grunt.registerTask('default', [
    'babel',
    'connect',
    'watch'
  ]);
};
