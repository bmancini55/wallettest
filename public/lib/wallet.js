
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
   * List of addresses in this wallet
   */
  Wallet.prototype.addresses = [];

  /**
   * Identifier for this wallet
   */
  Wallet.prototype.uuid = null;

  /**
   * Used for service verification that encrypted data belongs to the user
   */
  Wallet.prototype.sharedKey = null;


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

    var uuid = Wallet.generateUUID()
      , sharedKey = Wallet.generateSharedKey();

    if(uuid.length != 36)
      throw 'UUID was not generated correctly';

    if(sharedKey.length != 64)
      throw 'Shared Key was not generated correctly';

    this.uuid = uuid;
    this.sharedKey = sharedKey;
  }

  /**
   * Generates a UUID for identifying the wallet
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




