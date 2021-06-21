
 //we ususally rerun this file on node whenever we make changes on the Soldifuty contract. we run compilte.js first and then deplpy.js which are both inside our build folder. 
const HDWalletProvider = require("truffle-hdwallet-provider")    //requiring module from npm we just installed
const Web3 = require('web3')     //this is the Web3 Contsuctor becuase its capitalized, when lower case to be an instance                                    
const compiledFactory = require('./build/CampaignFactory.json')                //compilationm here is done as a seperate step under 'build' folder. Now we need to read this build folder off of the hard drive. So here we had to refactor for the compile stack.


const provider = new HDWalletProvider(                              //specifyfing which account we want to unlock and use as a source of either
    'clutch script pulse captain swim maple enlist wink teach series ivory neutral',   //mnemonic helps us derive public and private key. 
    'https://rinkeby.infura.io/v3/9fe59de2457e482ba05207c5dadc5dfd'    //mnemonic cam be used to generate many accoounts and does not specify a single spedific account
     )
 const web3 = new Web3(provider)                                       // i removed the quotes here. passing the provider in. its gonna pass provider to Web3 Constructor 
 
 const deploy = async () => {                                           //fucntion deploy, then calling depploy. mark it wuth async                   
    const accounts = await web3.eth.getAccounts(); 
    console.log('attempting to deploy account', accounts[0]);           // this specific account will be paying for the gas trasnsaction
    
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))      //actual deployment statement. accessting ethereum module inside the web3 instance thats been configured to connect to rinkeby net. making a new Contract taking in ABI(interface) and its being parsed by JSOn int a js object. UPDATE: b4 we were trying to parse the raw json from the compiler. but now: changed interface to 
    .deploy( { data: compiledFactory.bytecode } )                                         //the .deploy() statement is going to contain the contracts bytecode and any arguments. Initial argumetns we are passing into contract above. data is bytecode
    .send ( { gas: '1000000' , from: accounts[0] } );                     //sending transaction to the network. we making sure users can create instances of the campaign through the factory.
    
    console.log('contracts location at', result.options.address);        //logging the address to which the contract was deployed to
    }                                                                     //the only reason we are writing a func is to be able to use the async await syntax
  
 deploy(); 
 
 