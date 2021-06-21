import web3 from './web3'; //importing copy of web3 that was created in web3.js. Notice we are using lower case since we are not accessing the web3 library/constructor. We are importing the instance we created in web3.js
import CampaignFactory from './build/CampaignFactory.json'; //importing the compiled contract that is built inside of our directory(build folder). Anytime we need to tell web3 about an already deployed contract, we have to give web3 that contracts interface/ABI-and the ABI is defined inside the CampaginFactory.json.

const instance = new web3.eth.Contract(//next creating contract instance that refers to this specific address that we had already deployded thhe contract too and we will export it from this file. to get access to our deplpyed factory then all we do is import factory.js 
       JSON.parse(CampaignFactory.interface),                //first arg to this is going to be our contract ABI which exists inside the CampagaingFactory var above on line 2. The compiled CampaignFactory.json that we compiled earlier()inisde build folder) holds the ABI.  
           '0xee21d3106437cC4bC5bf5C0ee68bCf613643355E'                             //2nd arg is address of where our factory is already been deployed to (I think Rinkeby netwrk)
       );

export default instance; //this is a preconfigured instance of our campaign factory contract. We gonna use the factory instance to retireve a list of deployed campaigns