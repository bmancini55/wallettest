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

(function() {
  
  // List of address specifications for Base58Check formats
  // https://en.bitcoin.it/wiki/List_of_address_prefixess
  var AddressFormats = {

    // Bitcoin public key hash
    // PubKey:  17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem
    // PrivKey: 5Hwgr3u458GLafKBgxtssHSPqJnYoGrSzgQsPwLFhLNYskDPyyA
    BitcoinPubKeyHash: { 
      name: 'BitcoinPubKeyHash',

      pubKeyVersion: 0x00,  // 0
      pubKeyLeadingSymbol: { '1': true },
      pubKeyLength: { start: 27, end: 34 },

      privKeyVersion: 0x80, // 128
      privKeyLeadingSymbol: { '5': true },
      privKeyLength: { start: 51, end: 51 }
    },

    // Bitcoin script hash
    // PubKey:  3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX
    // PrivKey: 5Hwgr3u458GLafKBgxtssHSPqJnYoGrSzgQsPwLFhLNYskDPyyA
    BitcoinScriptHash: { 
      name: 'BitcoinScriptHash',

      pubKeyVersion: 0x05,  // 5
      pubKeyLeadingSymbol: { '3': true },
      pubKeyLength: { start: 34, end: 34 },

      privKeyVersion: 0x80, // 128
      privKeyLeadingSymbol: { '5': true },
      privKeyLength: { start: 51, end: 51 }
    },

    // Bitcoin TestNet public key hash
    // Note:  It appears that litecoin and namecoin both use the same format
    //        for their TestNets... 
    // PubKey:  mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn
    // PrivKey: 92Pg46rUhgTT7romnV7iGW6W1gbGdeezqdbJCzShkCsYNzyyNcc
    BitcoinTestNetPubKeyHash: {
      name: 'BitcoinTestNetPubKeyHash',
      
      pubKeyVersion: 0x6F,  // 111
      pubKeyLeadingSymbol: { 'm': true, 'n': true },
      pubKeyLength: { start: 34, end: 34 },

      privKeyVersion: 0xef, // 239
      privKeyLeadingSymbol: { '9': true },
      privKeyLength: { start: 51, end: 51 }
    },

    // Bitcoin TestNet script hash
    // PubKey:  mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn
    // PrivKey: 92Pg46rUhgTT7romnV7iGW6W1gbGdeezqdbJCzShkCsYNzyyNcc
    BitcoinTestNetScriptHash: {
      name: 'BitcoinTestNetScriptHash',
      
      pubKeyVersion: 0xC4,  // 196
      pubKeyLeadingSymbol: { '2': true },
      pubKeyLength: { start: 35, end: 35 },

      privKeyVersion: 0xef, // 239
      privKeyLeadingSymbol: { '9': true },
      privKeyLength: { start: 51, end: 51 }
    },

    // Litecoin public key hash
    // PubKey:  
    // PrivKey: 
    LitecoinPubKeyHash: {
      name: 'LitecoinPubKeyHash',

      pubKeyVersion: 0x30,  // 48
      pubKeyLeadingSymbol: { 'L': true },
      pubKeyLength: { start: 34, end: 34 },      

      privKeyVersion: 0xb0, // 176
      privKeyLeadingSymbol: { '6': true },
      privKeyLength: { start: 51, end: 51 }

    },

    // Namecoin public key hash
    // PubKey: 
    // PrivKey: 
    NamecoinPubKeyHash: {
      name: 'NamecoinPubKeyHash',

      pubKeyVersion: 0x34,  // 52
      pubKeyLeadingSymbol: { 'M': true, 'N': true },
      pubKeyLength: { start: 34, end: 34 },      

      privKeyVersion: 0xb4, //180
      privKeyLeadingSymbol: { '6': true },
      privKeyLength: { start: 51, end: 51 }

    },


    /**
     * Validates the WIF input based on the specified format
     */
    isValidFormat: function(input, format) {
      return typeof(input) === 'string' &&
        input.length >= format.privKeyLength.start &&
        input.length <= format.privKeyLength.end &&
        format.privKeyLeadingSymbol[input[0]];
    }
  };



  // Exports
  //


  window.FistWallet.AddressFormats = AddressFormats;
  

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
  //
  

  window.FistWallet.ECKey = ECKey;

})();




// module depends on FistWallet.ECKey, FistWallet.AddressFormats

(function() {
  'use strict';

  // Module dependencies
  var ECKey = FistWallet.ECKey
    , AddressFormats = FistWallet.AddressFormats

  // Local variables
    , defaultOptions;



  // Create the default address options
  defaultOptions = {
    format: FistWallet.AddressFormats.BitcoinPubKeyHash
  };
  


  /**
   * Represents an address as defined by the Bitcoin protocol.
   * An address in its public form is a Base58Check hash of a
   * ECDsA public key.
   */  
  var Address = function(options, data) {

    // merge default options
    this.options = options || {};
    for(var option in defaultOptions) {
      if(defaultOptions.hasOwnProperty(option) && !this.options.hasOwnProperty(option)) {
        this.options[option] = defaultOptions[option];
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
    else if (data && AddressFormats.isValidFormat(data, this.options.format)) {
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
    var result =  Bitcoin.Base58Check.decode(encoded);

    // validate version matches
    if(this.options.format.pubKeyVersion != result.version) {
      throw 'Decoded version does not match format';
    }

    // set the values
    this.version = result.version;
    this.publicKeyHashBytes = result.payloadBytes;
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

    var publicKeyHashBytes
      , format = this.options.format
      , pubKeyVersion = format.pubKeyVersion
      
    // set the hash bytes for this address
    this.publicKeyHashBytes = eckey.getPublicKeyHashBytes()

    // set the version from the address format
    this.version = pubKeyVersion;
  }


  /**
   * @private
   * Creates an address from WIF format
   */
  var createFromWIF = function(data) {

    var decodeResult
      , eckey
      , format = this.options.format
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
