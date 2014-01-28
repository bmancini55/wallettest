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

    // initialize flash messages
    Backbone.Flash.initialize();  
   
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

    className: 'home',

    template: templates.homeindex,

    events: {
      'click .create-button': 'showCreateForm',
      'click .open-button': 'showOpenForm',
      'submit .create-wallet': 'createWallet',
      'submit .open-wallet': 'openWallet'
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


    showCreateForm: function(e) {
      var me = this
        , createForm = this.$el.find('.create-wallet')
        , actionButtons = this.$el.find('.action-buttons');

      actionButtons.hide();
      createForm.show('slow');
    },

    showOpenForm: function(e) {
      var me = this
        , openForm = this.$el.find('.open-wallet')
        , actionButtons = this.$el.find('.action-buttons');

      actionButtons.hide();
      openForm.show('show');
    },

    createWallet: function(e) {

      var me = this
        , wallet
        , viewmodel
        , email = this.$el.find(".create-wallet input[name=email]").val()
        , pin = this.$el.find(".create-wallet input[name=pin]").val()
        , pass = this.$el.find(".create-wallet input[name=password]").val()
        , sharedkey;

      // cancel event if from event
      if(e) {
        e.preventDefault();
      }

      // create wallet and addresses
      var wallet = new FistWallet.Wallet();    
      wallet.createAddress(FistWallet.AddressFormats.BitcoinPubKeyHash);
      wallet.createAddress(FistWallet.AddressFormats.LitecoinPubKeyHash);
      wallet.createAddress(FistWallet.AddressFormats.NamecoinPubKeyHash);

      // set viewmodel

      FistWallet.Wallet.generateID(email, pin, function(err, id) {

        var sharedKey;

        if(err) {
          Backbone.trigger('flash', { message: err, type: 'failure' }, { el: me.$el });

        } else {

          // generate shared key
          sharedKey = FistWallet.Wallet.generateSharedKey();

          // build model
          app.walletModel = viewmodel = new app.WalletModel({ wallet: wallet });
          viewmodel.set('id', id);
          viewmodel.set('sharedkey', sharedKey);

          //redirect
          app.walletController.details();
 
        }
      });
    },

    openWallet: function(e) {
      
      var wallet 
        , viewmodel
        , email = this.$el.find('.open-wallet input[name=email]').val()
        , pin = this.$el.find('.open-wallet input[name=pin]').val()
        , pass = this.$el.find('.open-wallet intput[name=password]').val()
        , id = FistWallet.Wallet.generateID(email, pin);

      // cancel event if from event
      if(e) {
        e.preventDefault();
      }
    }

  });




  /**
   * Wallet details view
   */
  app.walletDetailsView = Backbone.View.extend({
    
    className: 'wallet-details',

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



Handlebars.registerHelper('callfunc', function(func) {
  return this[func]();
});
