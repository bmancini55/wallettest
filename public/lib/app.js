(function() {
  'use strict';

var app = FistWallet.app = { }
  , templates = FistWallet.templates 

  // currency collection
  app.currencies = new Backbone.Collection([
    { _id: 'bitcoin', name: 'Bitcoin', mainnet: { formats: ['BitcoinPubKeyHash', 'BitcoinScriptHash']}, testnet: { formats:['BitcoinTestNetPubKeyHash', 'BitcoinTestNameScriptHash'] }},
    { _id: 'litecoin', name: 'Litecoin', mainnet: { formats: ['LitecoinPubKeyHash']}, testnet: { formats: [] }},
    { _id: 'nameconi', name: 'Namecoin', mainnet: { formats: ['NamecoinPubKeyKey']}, testnet: { formats: [] }}
  ]);

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
   * Controller for home page
   */
  app.homeController = {    

    /** 
     * Display the home page
     */
    index: function() {
      
      var view = new app.homeView();
      app.mainView.setView(view, { render: true});
      app.router.navigate('/');
    } 
  }


  /**
   * Controller for managing your wallet
   */
  app.walletController = {

    /**
     * Shows the current wallet details
     */
    details: function() {

      // verify that we have a current wallet
      if(!app.walletModel) {
        app.homeController.index();
        return;
      }
      
      // render the current view model
      var view = new app.walletDetailsView({ model: app.walletModel });
      app.mainView.setView(view, { render: true});
      //app.router.navigate('wallet');
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
   * Wallet view model
   * This is an interfaces between
   * the FistWallet.Wallet and Backbone
   */
  app.WalletModel = Backbone.Model.extend({        

    addAddress: function(format) {
      
    },

    removeAddress: function(address) {

    }
    
  });

  app.AddressModel = Backbone.Model.extend({
    
  });

  app.AddressCollection = Backbone.Collection.extend({
    model: app.AddressModel

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

    setView: function(view, options) {

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

      // optionally render immediately
      if(options && options.render) {
        this.currentView.render();
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

    events: {
      'click .create-wallet': 'createWallet'
    },

    render: function() {
      console.log('rendering home index');

      var html = this.template({});
      this.$el.html(html);
      return this;
    },

    remove: function() {
      this.stopListening();
    },

    createWallet: function() {

      // create wallet and addresses
      var wallet = new FistWallet.Wallet();
      wallet.createAddress(FistWallet.AddressFormats.BitcoinPubKeyHash);
      wallet.createAddress(FistWallet.AddressFormats.LitecoinPubKeyHash);
      wallet.createAddress(FistWallet.AddressFormats.NamecoinPubKeyHash);
      app.walletModel = new app.WalletModel({ wallet: wallet });

      // load wallet details
      app.walletController.details();
    },

    getWallet: function() {
      
      // email + pin 
    }
  });

  /**
   * Wallet details view
   */
  app.walletDetailsView = Backbone.View.extend({
    
    className: 'wallet-details-view',

    template: templates.walletdetails,

    initialize: function() {
      
    },

    events: {
      
    },

    render: function() {
      console.log('rendering wallet details');

      // render main view
      var html = this.template(this.model.attributes);
      this.$el.html(html);

      // render currencies    
      return this;
    },

    remove: function() {
      this.stopListening();
    },

    createAddress: function() {

    }

  });

}());

Handlebars.registerHelper('callfunc', function(obj, func) {
  return obj[func]();
});
