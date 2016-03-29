module.exports = function gruntConfig(grunt) {
  require('load-grunt-tasks')(grunt);

  const files = ['gruntfile.js', 'index.js', 'test/**/*.js', 'src/**/*.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      folder: 'es5',
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime'],
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: './src/',
            src: './**/*.js',
            dest: './es5/',
          },
        ],
      },
    },

    eslint: {
      target: files,
    },

    mochaTest: {
      src: ['test/index.js'],
      options: {
        reporter: 'spec',
        require: ['babel-core/register'],
      },
    },

    browserify: {
      client: {
        src: ['src/**/*.js'],
        dest: 'browser/uport-sso.js',
        options: {
          transform: [['babelify']],
        },
      },
    },

    watch: {
      scripts: {
        files,
        tasks: ['eslint'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('build', ['clean', 'babel']);
  grunt.registerTask('test', ['eslint', 'mochaTest', 'build']);
};
