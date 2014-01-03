

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



