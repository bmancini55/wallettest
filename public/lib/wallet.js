
// WALLET MODULE

(function() {
  'use strict';

  // module dependencies
  var Address = FistWallet.Address
    , AddressFormat = FistWallet.AddressFormat



  /**
   * A wallet for storing blockchain addresses and transactions
   */
  function Wallet(data) {
 
    this.addresses = [];
    this.id = null;
    this.sharedKey = null;  
  
    // create a new wallet
    if(!data) {
      createNew.call(this);
    } 
    
    // applies the supplied properties to the wallet
    else {    

      // apply supplied options
      for(var datum in data) {
        if(data.hasOwnProperty(datum)) {
          this[datum] = data[datum];
        }
      }

    }
 };



  /**
   * Generates a new address
   * @param {AddressFormat} format of the address to create
   * @returns {Address}
   */
  Wallet.prototype.createAddress = function(format) {
    var me = this
      , address
      , addressBase58Check;

    // check format
    if(!format) {
      throw 'Format must be specified';
    }

    // generate the new address
    address = new Address({ format: format });

    // add new address to wallet
    me.addresses.push(address);

    return address;
  };



  // PRIVATE
  //

  /**
   * Creates a new wallet
   */
  var createNew = function() {

  
  }

  /**
   * Generates a UUID
   */

  Wallet.generateUUID = function() {

    var srng = new SecureRandom()
      , uuid = ""
      , bytes = new Array(16)
      , i
      , hex;
      
    // get random byte array
    srng.nextBytes(bytes);

    // construct uuid
    for(i = 0; i < bytes.length; i += 1) {

      // convert byte to hex
      hex = Crypto.util.bytesToHex(bytes.slice(i, i+1));

      // 12th position is a 4 signifying version 4 uuid
      if(i === 6) {
        uuid += "4" + hex[1];
      } 
      
      // 16th position must be 8, 9, A, or B
      else if (i === 8) {
        uuid += (parseInt(hex[0], 16) & 0x3 | 0x8).toString(16) + hex[1];
      } 
      
      // otherwise use hex character
      else {
        uuid += hex;
      }
      
      // insert dashes appropriately
      if(i === 3 || i === 5 || i === 7 || i === 9) {
        uuid += "-";
      }
    }

    return uuid;
  }

  /**
   * This uses the concatination of an email address
   * and 4-10 digit pin as the source for a hashed identifier
   */
  Wallet.generateID = function(email, pin, callback) {
  
    var emailRegex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
      , pinRegex = new RegExp(/^[0-9a-z]{4,64}$/i)
      , concat
      , hash;

    // validate email
    if(!email || !emailRegex.test(email)) {
      callback("Email is not valid", null);
      return;
    }

    // validate pin
    if(!pin || !pinRegex.test(pin)) {
      callback("Pin must be between 4 and 64 characters");
      return;
    }

    // concatinate email, delimiter, and pin
    concat = email + '|' + pin;

    // hash that biatch and return hex
    callback(null, Crypto.RIPEMD160(Crypto.SHA256(concat)));
  }



  /**
   * Generates a shared key for use at wallet creation
   */
  Wallet.generateSharedKey = function() {

    var srng = new SecureRandom()
      , bytes = [];

    // generate 256 bit random number
    bytes.length = 32;
    srng.nextBytes(bytes);

    return Crypto.util.bytesToHex(bytes);    

  }


  // EXPORT
  //
  window.FistWallet.Wallet = Wallet;


}());




