(function() {
  'use strict';

var app = FistWallet.app = { }
  , templates = FistWallet.templates  

  // Initializes the application
  app.initialize = function() {
   
    // render the main view
    this.mainView = new app.mainView();
    this.mainView.render();

    // start navigation
    this.router = new app.Router();
    Backbone.history.start({pushState: true });
  }


  /**
   * Logic for home page
   */
  app.homeController = {    
    index: function() {
      
      var view = new app.homeView();
      app.mainView.setView(view);
      view.render();

      app.router.navigate('/');
    } 
  }



  /**
   * Provides URL routing mechanism
   */
  app.Router = Backbone.Router.extend({
    routes: {
      '': function() { app.homeController.index() }
    }
  });




  /**
   * Main application view responsible for
   * displaying subviews and managing menus
   */
  app.mainView = Backbone.View.extend({

    el: 'body',

    className: 'main-view',

    template: templates.main,

    render: function() {
      console.log('rendering main view');

      var html = this.template({});
      this.$el.html(html);
      return this;
    },

    setView: function(view) {

      // remove the old view
      if(this.currentView) {
        this.currentView.remove();
      }

      // set the new view
      this.currentView = view;
      
      // attach render to as the main body for the new view
      // defer rendering to the caller
      if(this.currentView) {
        this.$el.find(".current-view").html(this.currentView.$el);        
      }

    },

    currentView: null

  });


  /**
   * Home index view
   */
  app.homeView = Backbone.View.extend({    

    className: 'home-view',

    template: templates.homeindex,

    render: function() {
      console.log('rendering home index');

      var html = this.template({});
      this.$el.html(html);
      return this;
    },

    remove: function() {
      this.stopListening();
    }    
  });

}());
