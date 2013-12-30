
var FistWallet = FistWallet || {};


(function() {
  'use strict';

  var fistWalletApp

  fistWalletApp = window.fistWalletApp = { }


  fistWalletApp.initialize = function() {
   
    // render the main view
    this.mainView = new fistWalletApp.mainView();
    this.mainView.render();

    // start navigation
    Backbone.History.start({pushstate: true });
  }

  // home controller
  fistWalletApp.homeController = {
    index: function() {
      
      var view = new fistWalletApp.homeView();
      fistWalletApp.mainView.setView(view);

      fistWalletApp.router.navigate('/');
    } 
  }

  // the router for the application
  fistWalletApp.router = Backbone.Router.extend({
    routers: {
      '/': fistWalletApp.homeController.index
    }
  });

}());




(function() {
  'use strict';

  /**
   * The main application view
   */
  fistWalletApp.mainView = Backbone.View.extend({

    renderTo: 'body',

    tagName: 'div',

    render: function() {

      var template = Handlebars.compile($("#tpl-mainview").text());
      this.$el.html(template({}));
      return this;
    },

    setMainView: function(view) {

      // remove the old view
      if(this.currentView) {
        this.currentView.remove();
      }

      // set the new view
      this.currentView = view;
      
      // attach render to as the main body for the new view
      // defer rendering to the caller
      if(this.currentView) {
        this.$el.find(".main-view").html('<div class="main-view-conent"></div>');
        this.currentView.renderTo = ".main-view-content";
      }

    },

    currentView: null

  });


  /**
   * Home index view
   */
  fistWalletApp.homeView = Backbone.View.extend({

    className: 'home-view',

    render: function() {

      var template = Handlebars.compile($("#tpl-homeindex"));
      this.$el.html(template({}));
      return this;

    },

    remove: function() {
      this.stopListening();

    }
  });

}());
