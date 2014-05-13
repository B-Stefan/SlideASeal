exports.config = {
  "modules": [
    "copy",
    "server",
    "jshint",
    "csslint",
    "require",
    "minify-js",
    "minify-css",
    "live-reload",
    "bower",
    "coffeescript",
    "sass",
    "handlebars"
  ],
  "server": {
    "views": {
      "compileWith": "handlebars",
      "extension": "hbs"
    }
  }
}