// globals window

window.FistWallet = window.FistWallet || {};

(function() {

  function Base58Check() { }

  Base58Check.encode = function(version, payloadBytes) {
    var bytes
      , checksum;

    // copy payload bytes
    var bytes = payloadBytes.slice(0);

    // prepend version
    bytes.unshift(version);

    // append first 4-bytes of checksum
    checksum = Crypto.SHA256(Crypto.SHA256(bytes, {asBytes: true}), {asBytes: true});
    bytes = bytes.concat(checksum.slice(0, 4));

    // base58 encode 
    return Bitcoin.Base58.encode(bytes);

  }

  Base58Check.decode = function(encoded) {
     var bytes    
      , version
      , checksumBytes
      , checksum;

    // decode from base 58
    bytes = Bitcoin.Base58.decode(encoded);

    // verify checksum of last 4 bytes
    checksumBytes = bytes.slice(bytes.length - 4);
    bytes = bytes.slice(0, bytes.length - 4);
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
      payloadBytes: bytes
    };
  }

  Bitcoin.Base58Check = Base58Check;

}());




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
    else if (data && data instanceof FistWallet.ECKey) {
      createFromECKey.call(this, data);
    }

    // creates an address from WIF
    else if (data && typeof(data) === "string" && data.length === 51 && data[0] === '5') {
      createFromWIF.call(this, data);
    }
  }



  // PUBLIC MEMBERS
  //
  
  /**
   * Encodes the Address in the standard format (Base58Check):
   * 
   * Version = 1 byte of 0 (zero); on the test network, this is 1 byte of 111
   * Key hash = Version concatenated with RIPEMD-160(SHA-256(public key))
   * Checksum = 1st 4 bytes of SHA-256(SHA-256(Key hash))
   * Bitcoin Address = Base58Encode(Key hash concatenated with Checksum)
   *
   * https://en.bitcoin.it/wiki/Protocol_specification#Addresses
   */
  Address.prototype.encode = function() {
    return Bitcoin.Base58Check.encode(this.version, this.publicKeyHashBytes);
  }

  /**
   * Decodes from the standard format (Base58Check):
   *
   * Version = 1 byte of 0 (zero); on the test network, this is 1 byte of 111
   * Key hash = Version concatenated with RIPEMD-160(SHA-256(public key))
   * Checksum = 1st 4 bytes of SHA-256(SHA-256(Key hash))
   * Bitcoin Address = Base58Encode(Key hash concatenated with Checksum)
   *
   * https://en.bitcoin.it/wiki/Protocol_specification#Addresses
   */
  Address.prototype.decode = function(encoded) {
    return Bitcoin.Base58Check.decode(encoded);
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

  var createFromWIF = function(wif) {
    var eckey = new FistWallet.ECKey(wif);
    createFromECKey.call(this, eckey);
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
    
    // create a new key if no input
    if(!input) {
      createNew.call(this);

    } 

    // import using wallet import format
    else if(typeof(input) === "string" && input.length === 51 && input[0] === "5") {
      createFromWIF.call(this, input);
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


  /**
   * Private key represented by a BigNumber 
   */
  ECKey.prototype.priv = null;

  /**
   * Output the key compressed format
   */
  ECKey.prototype.compressed = false;




  // PRIVATE FUNCTIONS
  //

  /**
   * @private
   * Creates a new ECKey
   */
  var createNew = function() {
    var n = ecparams.getN();
    this.priv = ECDSA.getBigRandom(n);
    this.compressed = false;
  }

  /**
   * @private 
   * creates an ECKey from WIF format
   */
  var createFromWIF = function(data) {
    var decodeResult
      , priv;
    
    // decode from base58check format
    decodeResult = Bitcoin.Base58Check.decode(data);

    // validate version
    if(decodeResult.version != 0x80) {
      throw "Unsupported private key version";
    }

    // convert the byte array to a BigInteger
    priv = BigInteger.fromByteArrayUnsigned(decodeResult.payloadBytes);

    // set priv value
    this.priv = priv;
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
