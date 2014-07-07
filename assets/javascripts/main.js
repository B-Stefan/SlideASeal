require({
  //urlArgs: "b=" + ((new Date()).getTime()),
  paths: {
    jquery: 'vendor/jquery/jquery',
    Phaser: 'vendor/phaser/phaser',
    '_': 'vendor/underscore/underscore'
  },
  shim: {
    Phaser: {
      exports: 'Phaser'
    },
    '_': {
        exports: '_'
    }
  }
});

define(['jquery', 'app/Game'], function($) {

    Array.prototype.removeByValue = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === val) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    }

    $(document).ready(function() {

      $( "#gamelink" ).val("http://" + window.location.host + "/" + $("#sessionid").text() );

      $( "#open-instruction" ).click(function() {
        $( "#instruction" ).fadeIn("slow");
        $( "#instruction-video" )[0].play();

      });

      $( "#instruction" ).click(function() {
        $( "#instruction" ).fadeOut("slow");
        $( "#instruction-video" )[0].pause();
      });

        /**
         * Info box select complete url if click
         */
      $("#info").find("input").click(function () {
            $(this).select();
      });

    });

});