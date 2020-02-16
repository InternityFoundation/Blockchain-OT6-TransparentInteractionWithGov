var express =  require('express');
var Web3 = require('web3');
var eth = require('web3-eth')
const stringify = require('json-stringify-safe')
const await = require('await');
const bodyParser = require('body-parser');
const Tx = require('ethereumjs-tx').Transaction
var fs = require('fs');
require('dotenv').config()


const app = express();
const port = 3003;
app.use(express.json());

// .env file content declaration
var ABI = fs.readFileSync('abi', 'utf8');
var account = process.env.OWNER_ACC;
var contractAddress = process.env.CONTRAT_ADD;
var Infura_Key =process.env.INFURA_KEY;
const privateKey = Buffer.from(process.env.PRIV_KEY, 'hex')


const web3 = new Web3(Infura_Key);

const myContract = new web3.eth.Contract(JSON.parse(ABI),contractAddress, {
    defaultAccount:account, // default from address
    defaultGasPrice: '3000000' // default gas price in wei, 20 gwei in this case
  });



app.get('/creatorAddress', async (req, res) => {
    console.log("**** GET /creatorAddress ****");
  
    try {
        myContract.methods.creator().call().then(function(data){
            res.json({'Success':'True','creatorAddress':data})
        }).catch(function(err) {
            console.log(err);
            res.json({'Success':'False','ERROR':err})
        });
    } catch (e) {
      console.log(e)
      res.sendStatus(500).json({
              success: false,
              message: 'Please check the request'
          });
    }
});




app.post('/registerGovermentBodies', async (req, res) => {
    console.log("**** POST /registerGovermentBodies ****");

    var id = req.body.id;
    var govbodies = req.body.govbodies;
    var name = req.body.name;
  
    try {
        web3.eth.getTransactionCount('0x1c47ab2738e07114450F8a1B58a5DaFed1c01026',(err,txCount) =>{
            console.log("In the Block")
            console.log("Error",err)
           
        const txObject = {
            nonce:web3.utils.toHex(txCount),
            to:contractAddress,
            value:'0x00',
            data:myContract.methods.govBodies(id,govbodies,name).encodeABI(),
            gasLimit:web3.utils.toHex(62000),
            gasPrice:web3.utils.toHex(web3.utils.toWei('45','gwei')),
            chainId: 0x01
        }
        
        console.log("Transaction Object",txObject)
        
        const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' },)
        console.log("tx obj",tx)
        tx.sign(privateKey)
        const serializedTransaction = tx.serialize()
        
        console.log("serialized Transaction",serializedTransaction)
        const raw = '0x'+ serializedTransaction.toString('hex')
        console.log("Raw Transaction",raw)
        web3.eth.sendSignedTransaction(raw,(err,txHash)=>{
            console.log("Error",err)
            console.log('txHash:',txHash)
            res.json({'Tx Hash':txHash})
        })
        })
    } catch (e) {
      console.log(e)
      res.sendStatus(500).json({
              success: false,
              message: 'Please check the request'
          });
    }
});
  
  
  













  // Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
 
    console.log(`Server listening on port ${server.address().port}`);
})

