
// This module is used for encrypting and decrypting wallet files

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

