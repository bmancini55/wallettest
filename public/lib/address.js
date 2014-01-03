

// ADDRESS MODULE
// module depends on FistWallet.ECKey, FistWallet.AddressFormats

(function() {
  'use strict';

  // Module dependencies
  var ECKey = FistWallet.ECKey
    , AddressFormats = FistWallet.AddressFormats
    , Base58Check = FistWallet.Base58Check

  // Local variables
    , defaultOptions
    , Address;



  // Create the default address options
  defaultOptions = {
    format: FistWallet.AddressFormats.BitcoinPubKeyHash
  };
  


  /**
   * Represents an address as defined by the Bitcoin protocol.
   * An address in its public form is a Base58Check hash of a
   * ECDsA public key.
   */  
  Address = function(options, data) {

    // apply default options
    for(var option in defaultOptions) {
      if(defaultOptions.hasOwnProperty(option)) {              
        this[option] = defaultOptions[option];
      }      
    }  

    // apply supplied options
    for(var option in options) {
      if(options.hasOwnProperty(option) && defaultOptions.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }

    // creates a new address
    if(!data) {
      createNew.call(this);
    } 

    // creates an address from a key
    else if (data && data instanceof ECKey) {
      createFromECKey.call(this, data);
    }

    // creates an address from WIF
    else if (data && AddressFormats.isValidFormat(data, this.format)) {
      createFromWIF.call(this, data);
    }

    // fail import if we get here
    else {
      throw 'Address failed to import';
    }
  }



  // PUBLIC MEMBERS
  //
  

  /**
   * User friendly name for the address
   */
  Address.prototype.name = '';

  /**
   * A hashed byte array for the elliptic curve public key
   * that this address represents
   *
   * This is the payload of a base58check version of the
   * address in byte form
   */
  Address.prototype.pubKeyHashBytes = null;

  /**
   * This is the private key as taken from the Elliptic
   * Curve key in byte form
   */
  Address.prototype.privKeyBytes = null;

  
  /**
   * Encodes the public key hash in the standard format (Base58Check):
   * 
   * Version = 1 byte of 0 (zero); on the test network, this is 1 byte of 111
   * Key hash = Version concatenated with RIPEMD-160(SHA-256(public key))
   * Checksum = 1st 4 bytes of SHA-256(SHA-256(Key hash))
   * Bitcoin Address = Base58Encode(Key hash concatenated with Checksum)
   *
   * https://en.bitcoin.it/wiki/Protocol_specification#Addresses
   */
  Address.prototype.encodePubKeyHash = function() {

    var format = this.format
      , version = this.format.pubKeyVersion
      , bytes = this.pubKeyHashBytes

    return Base58Check.encode(version, bytes);
  }

  /**
   * Decodes the Address public key hash from standard format (Base58Check)
   * and mutates the pubKeyHashBytes property
   *
   * Version = 1 byte of 0 (zero); on the test network, this is 1 byte of 111
   * Key hash = Version concatenated with RIPEMD-160(SHA-256(public key))
   * Checksum = 1st 4 bytes of SHA-256(SHA-256(Key hash))
   * Bitcoin Address = Base58Encode(Key hash concatenated with Checksum)
   *
   * https://en.bitcoin.it/wiki/Protocol_specification#Addresses
   */
  Address.prototype.decodePubKeyHash = function(encoded) {

    var format = this.format
      , version = format.pubKeyVersion
      , result;
      
    // decode the pub key hash
    result = Base58Check.decode(encoded);

    // validate version matches
    if(version != result.version) {
      throw 'Decoded version does not match format';
    }

    // set the values
    this.pubKeyHashBytes = result.payloadBytes;

    // return the bytes
    return this.pubKeyHashBytes;
  }

  /**
   * Creates an export via WIF
   */
  Address.prototype.encodePrivKey = function() {
    
    var format = this.format
      , version = format.privKeyVersion
      , bytes = this.privKeyBytes;

    return  Base58Check.encode(version, bytes);

  }

  /**
   * Decodes an export via WIF and mutates the privKeyHashBytes property
   */
  Address.prototype.decodePrivKey = function(encoded) {
    
    var format = this.format
      , version = format.privKeyVersion
      , result;

    // decode the priv key wia base58check
    result = Base58Check.decode(encoded);

    // verify the verion matches
    if(version != result.version) {
      throw 'Decoded version does not match format';
    }

    // set the private key
    this.privKeyBytes = result.payloadBytes;

    return this.privKeyBytes;
  }




  // PRIVATE MEMBERS
  //



  /**
   * @private
   * Generates a new address
   */
  var createNew = function() {

    // generate a new ECKey instance
    var ecKey = new ECKey();

    // generate the address from an ECKey instance
    createFromECKey.call(this, ecKey);
  }


  /**
   * @private
   * Creates an address from an ECKey instance
   */
  var createFromECKey = function(eckey) {

    var pubKeyHashBytes
      , format = this.format
      , pubKeyVersion = format.pubKeyVersion;
    
    // cache the private key
    this.privKeyBytes = eckey.getPrivateKeyBytes();
      
    // set the hash bytes for this address
    this.pubKeyHashBytes = eckey.getPublicKeyHashBytes()

  }


  /**
   * @private
   * Creates an address from WIF format
   */
  var createFromWIF = function(data) {

    var decodeResult
      , eckey
      , format = this.format
      , privKeyVersion = format.privKeyVersion;
  
    // decode from base58check
    decodeResult = Bitcoin.Base58Check.decode(data);

    // validate version
    if(decodeResult.version != privKeyVersion) {
      throw "Unsupported private key version";
    }

    // create eckey
    eckey = new ECKey(decodeResult.payloadBytes);

    // generate address from eckey
    createFromECKey.call(this, eckey);
  }




  // EXPORTS
  //
  
  
  window.FistWallet.Address = Address;

})();




