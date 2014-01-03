(function() {
  'use strict';


  
  /**
   * Base58Check utility class for performing 
   * the Base58Check operations that are used for crypto-currency addresses
   * and the wallet-import format.
   */
  var Base58Check = function() { }



  /**
   * Performs Base58Check encoding according to the following specification:
   * https://en.bitcoin.it/wiki/Base58Check_encoding
   *
   * 1) Concatinate version and payload bytes
   * 2) Take the first 4 bytes of SHA256D of the concatinated stage 1 output
   * 3) Convert to Base58  
   */
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



  /**
   * Performs Base58Check decoding according to the following specifications:
   * https://en.bitcoin.it/wiki/Base58Check_encoding
   *
   * 1) Decode from base58
   * 2) Remove last 4bytes
   * 3) Perform SHA256D checksum and compare to last 4bytes
   * 4) Strip version
   *
   * @returns {Object} results object with
   *  @param {Numeric} version
   *  @param {ByteArray} payload bytes
   */
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



  // ExPORT
  window.FistWallet.Base58Check = Base58Check;

}());


