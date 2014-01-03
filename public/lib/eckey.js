
// ECKEY MODULE
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

    // import from raw byte array
    else if(input instanceof Array) {
      createFromByteArray.call(this, input);
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
   * Gets the private key as bytes
   */
  ECKey.prototype.getPrivateKeyBytes = function() {

    return this.priv.toByteArrayUnsigned();
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
   * creates an ECKey from a byte array
   */
  var createFromByteArray = function(data) {
    
    // convert the byte array to a BigInteger
    this.priv = BigInteger.fromByteArrayUnsigned(data);
  }



  /**
   * Gets the public key as DER encoded byte array
   */
  var getPublicKeyDERBytes = function() {

    var publicPoint
      , derBytes;

    // get the public point as an ECPointFp object
    publicPoint = ecparams.getG().multiply(this.priv);
    
    // get point encoded in DER format as bytes
    derBytes = publicPoint.getEncoded(this.compressed);

    return derBytes;
  }


  // EXPORT
  //
  

  window.FistWallet.ECKey = ECKey;

})();



