// this is something we can do up front and then any function that implements
// will check this out
var noter = function(options){

  var self = {};

  self.options = options;

  var permissions = function(func){

    // check support
    if (Notification && Notification.permission === "granted") {

      // go time
      func();

    } else if (Notification && Notification.permission !== 'granted') {

      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }

        if (status === 'granted') {
          // go time
          func();
        }

        return false;

      });
    }
  },
      autoClose = function(note){
        note.onshow = function () {
          setTimeout(function(){
            note.close();
          }, 3000);
        };
      },

      merge = function(baseOpts){
        var i = 0;
        for(i; i<arguments.length; i++) {
          var next = arguments[i+1];
          if(next){
            var opt;
            for(opt in next){
              if(next.hasOwnProperty(opt)){
                baseOpts[opt] = next[opt];
              }
            }
          }
        }
        return baseOpts;
      };

  self.send = function(title, options){

    options = merge(self.options, options);

    permissions(function(){

      var note = new Notification(title, options);

      if(options.close){
        autoClose(note);
      }

    });
  };
  return self;
};
