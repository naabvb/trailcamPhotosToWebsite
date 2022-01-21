module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compress: {
      create_gz: {
        options: {
          mode: 'gzip',
          level: 9,
        },
        expand: true,
        cwd: 'build/',
        dest: 'build/',
        extDot: 'last',
        src: ['**/*.{js,css,html,ico,json}'],
        rename: (dest, src) => {
          return `${dest}${src}.gz`;
        },
      },
      create_br: {
        options: {
          mode: 'brotli',
          brotli: {
            quality: 11,
          },
        },
        expand: true,
        cwd: 'build/',
        dest: 'build/',
        extDot: 'last',
        src: ['**/*.{js,css,html,ico,json}'],
        rename: (dest, src) => {
          return `${dest}${src}.br`;
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.registerTask('default', ['compress:create_gz', 'compress:create_br']);
};
