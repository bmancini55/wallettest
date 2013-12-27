// globals window

window.FistWallet = window.FistWallet || {};


(function() {
  'use strict';




  function Wallet() { 
    this.addressHash = {}
    this.addressChain = []
    this.currentAddressIndex = 0;
  };


  /**
   * Generates a new address
   * */
  Wallet.prototype.createAddress = function() {
    var me = this
      , key 
      , address
      , addressString;

    // generate the new address
    key = new Bitcoin.ECKey();
    address = key.getBitcoinAddress();
    addressString = address.toString();

    // push into address lookup if not already in wallet
    if(!me.addressHash.hasOwnProperty(addressString)) {
      me.addressHash[addressString] = address;
      me.addressChain.push(address);
    }

    return address;
  };


  /**
   * Encrypts the wallet using BIP38
   */
  Wallet.prototype.encrypt = function(eckey, passphrase, success, error) {
    
  }


  Wallet.prototype.decrypt = function(base58bip38, passphrase, success, error) {
    
    // unencode base58 to bytes

    // verify length is 43 bytes
    
    // verify start byte is 01
    
    // verify checksum

    // get EC-multi bit 
        
  }


  // EXPORT
  //
  window.FistWallet.Wallet = Wallet;


}());


// module depends on FistWallet.ECKey

(function() {
  'use strict';

  /**
   * Represents an address as defined by the Bitcoin protocol.
   * An address in its public form is a base-58 encoded hash of an
   * ECDsA public key.
   */  
  var Address = function(data) {

    // creates a new address
    if(!data) {
      createNew.call(this);
    } 

    // creates an address from a key
    else if(data && data instanceof FistWallet.ECKey) {
      createFromECKey.call(this);
    }
  }



  // PUBLIC MEMBERS
  //
  
  /**
   * Encodes the Address in the standard format:
   * 
   * Version = 1 byte of 0 (zero); on the test network, this is 1 byte of 111
   * Key hash = Version concatenated with RIPEMD-160(SHA-256(public key))
   * Checksum = 1st 4 bytes of SHA-256(SHA-256(Key hash))
   * Bitcoin Address = Base58Encode(Key hash concatenated with Checksum)
   *
   * https://en.bitcoin.it/wiki/Protocol_specification#Addresses
   */
  Address.prototype.encode = function() {
      
    var bytes
      , checksum;

    // copy publicKeyHashBytes
    var bytes = this.publicKeyHashBytes.slice(0);

    // prepend version
    bytes.unshift(this.version);

    // append first 4-bytes of checksum
    checksum = Crypto.SHA256(Crypto.SHA256(bytes, {asBytes: true}), {asBytes: true});
    bytes = bytes.concat(checksum.slice(0, 4));

    // base58 encode 
    return Bitcoin.Base58.encode(bytes);
  }

  /**
   * Decodes from the standard format:
   *
   * Version = 1 byte of 0 (zero); on the test network, this is 1 byte of 111
   * Key hash = Version concatenated with RIPEMD-160(SHA-256(public key))
   * Checksum = 1st 4 bytes of SHA-256(SHA-256(Key hash))
   * Bitcoin Address = Base58Encode(Key hash concatenated with Checksum)
   *
   * https://en.bitcoin.it/wiki/Protocol_specification#Addresses
   */
  Address.prototype.decode = function(encoded) {
    
    var bytes    
      , version
      , checksumBytes
      , checksum;

    // decode from base 58
    bytes = Bitcoin.Base58.decode(encoded);

    // verify checksum
    checksumBytes = bytes.slice(21);
    bytes = bytes.slice(0,21);
    checksum = Crypto.SHA256(Crypto.SHA256(bytes, {asBytes: true}), {asBytes: true});

    if  (checksumBytes[0] != checksum[0] ||
         checksumBytes[1] != checksum[1] ||
         checksumBytes[2] != checksum[2] ||
         checksumBytes[3] != checksum[3]) 
      throw "Checksum validation failed";

    // get version
    version = bytes.shift(0);

    // return version and bytes
    return {
      version: version,
      publicKeyHashBytes: bytes
    };
  }


  // PRIVATE MEMBERS
  //

  var createNew = function() {
    var ecKey;
    ecKey = new FistWallet.ECKey();
    createFromECKey.call(this, ecKey);
  }

  var createFromECKey = function(eckey) {
    var publicKeyHashBytes = eckey.getPublicKeyHashBytes();
    this.publicKeyHashBytes = publicKeyHashBytes;
    this.version = 0x00;
  }


  // EXPORTS
  //
  window.FistWallet.Address = Address;

})();




// modules depends on Bitcoin.ECDSA, crypto.ripe160, crypto.sha256, jbn.ec, jbn.prng, jbn.rng

(function() {
  'use strict';

  var ECDSA = Bitcoin.ECDSA
    , ecparams = getSECCurveByName("secp256k1")
    , rng = new SecureRandom();


  /**
   * Represents an elliptic curve key
   */
  var ECKey = function(input) {
    
    if(!input) {
      createNew.call(this);
    }
    
  }

  // PUBLIC FUNCTIONS
  //
  
  /**
   * Get the public key in standard bitcoin hash format
   * and returns a byte array
   * 
   * As calculated with RIPE160(SHA256(DER public key))
   */
  ECKey.prototype.getPublicKeyHashBytes = function() {

    // get the public key in DER encoding format
    var publicKeyDERBytes = getPublicKeyDERBytes.call(this);

    // SHA256 and RIPEMD160 hash of the public key
    return Crypto.RIPEMD160(Crypto.SHA256(publicKeyDERBytes, {asBytes: true}), {asBytes: true});
  }




  // PRIVATE FUNCTIONS
  //

  var createNew = function() {
    var n = ecparams.getN();
    this.priv = ECDSA.getBigRandom(n);
    this.compressed = false;
  }

  /**
   * Gets the public key as DER encoded byte array
   */
  var getPublicKeyDERBytes = function() {

    var publicPoint
      , derBytes;

    // get the public point as an ECPointFp object
    publicPoint = getPublicPoint.call(this);
    
    // get point encoded in DER format as bytes
    derBytes = publicPoint.getEncoded(this.compressed);

    return derBytes;
  }

  /**
   * Gets the public point as an ECPointFp object
   */
  var getPublicPoint = function() {
    if(!this.publicPoint) {
      this.publicPoint = ecparams.getG().multiply(this.priv);
    }
    return this.publicPoint;
  }

  // EXPORT
  window.FistWallet.ECKey = ECKey;

})();
