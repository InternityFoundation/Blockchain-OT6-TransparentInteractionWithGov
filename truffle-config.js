require('dotenv').config()
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.MNEMONIC;
var Infura_ropsten = process.env.INFURA_KEY_ROPSTEN;



module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    
  },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic,Infura_ropsten);
      },
      network_id: 3
    }  ,
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/c469694a88af4a4ab024696bb245af20")
      },
      network_id: 42
    }  
    
  },compilers: {
    solc: {
      version: "0.5.10"  // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
 }
};
