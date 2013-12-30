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
  
  // List of address specifications for Base58Check formats
  // https://en.bitcoin.it/wiki/List_of_address_prefixess
  var AddressFormats = {

    // Bitcoin public key hash
    // PubKey:  17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem
    // PrivKey: 5Hwgr3u458GLafKBgxtssHSPqJnYoGrSzgQsPwLFhLNYskDPyyA
    BitcoinPubKeyHash: { 
      name: 'BitcoinPubKeyHash',
      currency: 'Bitcoin',
      network: 'Main',

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
      currency: 'Bitcoin',
      network: 'Main',

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
      currency: 'Bitcoin',
      network: 'Test',
      
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
      currency: 'Bitcoin',
      network: 'Test',
      
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
      currency: 'Litecoin',
      network: 'Main',

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
      currency: 'Namecoin',
      network: 'Main',

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




// ADDRESS MODULE
// module depends on FistWallet.ECKey, FistWallet.AddressFormats

(function() {
  'use strict';

  // Module dependencies
  var ECKey = FistWallet.ECKey
    , AddressFormats = FistWallet.AddressFormats
    , Base58Check = Bitcoin.Base58Check

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






// WALLET MODULE
// Module dependencies on FistWallet.Address, FistWAllet.AddressFormat

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





(function() {
  
  // module dependencies
  var Base58Check = Bitcoin.Base58Check
    , Wallet = FistWallet.Wallet
    , Address = FistWallet.Address
    , AddressFormats = FistWallet.AddressFormats
  
  // local variables
    , Packer
    , PackerV1;


  // NOTE this may be better as a direct
  //      serialization to prevent new properties
  //      from getting missed
  function getAddressJson(address) {
    return {
      name: address.name,
      format: address.format.name,
      pub: address.encodePubKeyHash(),
      priv: address.encodePrivKey()
    }
  }

  // NOTE this may be better as a direct
  //      serialization to prevent new properties 
  //      from getting missed
  function getWalletJson(wallet) {

    var addresses = wallet.addresses 
      , addressJson = [];      

    // create json for each address
    addresses.forEach(function(address) {
      addressJson.push(getAddressJson(address));
    });

    return {
      version: wallet.version,
      uuid: wallet.uuid,
      sharedKey: wallet.sharedKey,
      salt: wallet.salt,
      addresses: addresses
    };
  }  


  // NOTE this may be better implemented on the Address class
  //
  function getAddressFromJson(json) {
    var format
      , address;
    
    format = AddressFormats[json.format];
    address = new Address(format, json.priv);
    address.name = json.name;

    return address;
  }

  // NOTE this may be better implemented on the Wallet class
  //
  function getWalletFromJson(json) {
    var wallet
      , addresses;

    wallet  = new Wallet();
    wallet.uuid = json.uuid;
    wallet.sharedKey = json.sharedKey;

    // create address instance for each address json
    json.addresses.forEach(function(addressJson) {

      var address = getAddressFromJson(addressJson);
      wallet.addresses.push(address);

    });

    return wallet;
  }


  // Generates a 64-bit salt for use by packers
  //
  function generateSalt() {

    var srng = new SecureRandom()
      , bytes = new Array(8);

    srng.nextBytes(bytes);
    return bytes;
  }


 

  Packer = function() { }

  Packer.prototype.pack = function() {
    throw 'pack was not implemented';
  }

  Packer.prototype.unpack = function() {
    throw 'unpack was not implemented';
  }





  PackerV1 = function() {

    this.version = 1;
    this.scryptIterations = 2048;   // N - general work to perform
    this.scryptMemory = 8;          // r - block size scales memory usage
    this.scryptCPU = 1;             // p - parallelization scales cpu usage
    this.scryptKeyLength = 32       // the resulting length of the derived key

  };

  PackerV1.prototype.pack = function(wallet, passphrase, callback) {
    
    var version = 1
      , scryptIterations = this.scryptIterations
      , scryptMemory = this.scryptMemory
      , scryptCPU = this.scryptCPU
      , scryptKeyLength = this.scryptKeyLength
      , uuid = wallet.uuid
      , payload
      , cipher
      , salt      


    // generate salt
    salt = generateSalt();
    
    // generate JSON
    payload = JSON.stringify(getWalletJson(wallet));

    // derive password using scrypt
    Crypto.scrypt(passphrase, salt, scryptIterations, scryptMemory, scryptCPU, scryptKeyLength, function(derivedBytes) {

      var cipher
        , encoded;
      
      // encrypt with AES
      cipher = Crypto.AES.encrypt(payload, derivedBytes, { mode: new Crypto.mode.CBC(Crypto.pad.iso10126), asBytes: true});    

      // create base58Check
      encoded = Base58Check.encode(version, cipher);
    
      // generate package
      callback({ 
        version: version,
        uuid: uuid,
        salt: Crypto.util.bytesToHex(salt),
        payload: encoded,
      })
    
    });

  }

  PackerV1.prototype.unpack = function(package, passphrase, callback) {
      
    var version = this.version
      , scryptIterations = this.scryptIterations
      , scryptMemory = this.scryptMemory
      , scryptCPU = this.scryptCPU
      , scryptKeyLength = this.scryptKeyLength
      , payload = package.payload
      , salt = Crypto.util.hexToBytes(package.salt)
      
      , unencoded
      , json
      , wallet;


    // unencode base58check
    unencoded = Base58Check.decode(payload);

    // use script for password extension
    Crypto.scrypt(passphrase, salt, scryptIterations, scryptMemory, scryptCPU, scryptKeyLength, function(derivedBytes) {

      // decrypt with AES
      try {
        json = Crypto.AES.decrypt(unencoded.payloadBytes, derivedBytes, { mode: new Crypto.mode.CBC(Crypto.pad.iso10126) });
        json = JSON.parse(json);
      } catch (ex) {
        throw 'Incorrect passphrase entered';
      }

      // construct wallet
      wallet = getWalletFromJson(json);
      callback(wallet);

    });

  }
   


  // EXPORTS
  //

  window.FistWallet.Packer = Packer;
  window.FistWallet.PackerV1 = new PackerV1();

})();

