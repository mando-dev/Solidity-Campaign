const assert = require('assert');// this test file tests both Campaign and CampaignFactory- we put them together since CampaignFactory really only does 2 thing: create instance of Campaing and it retrievs all the instances it has deployed.
const ganache = require('ganache-cli');
const Web3 = require('web3'); //pulling in Web3 contsructor
const web3 = new Web3(ganache.provider());   //immediately making an instance of Web3. ganache is a server where you can test your contracts/

const compiledFactory = require('../ethereum/build/CampaignFactory.json');   //requiring in our 2 compiled versions of our contracts. so basically this was to (get out of the test directory)walk all the way up to the top of our project and into build folder.
const compiledCampaign = require('../ethereum/build/Campaign.json')//requiring in the campaign itself

let accounts;   //declaring reusable variables. accounts is going to be all the accounts existing in this local ganache network. 
let factory;    // reference to the deployed instance of the deployed factory we are going to make-look above 'compiledFactory'
let campaignAddress; //instead of using the factory inside every it statement to create a seperate instance of a campaign, we will make one campaign from the get go inside the beforeEach, then we will have it available in every other it statemetn inside this file-this the purpose of these two vars. Below we will assign the campain of the var on next line to 'campaignAddress'
let campaign; // we will save time from having the factory constantly make an instance of the campaign-this the purpose of these last 2 lets. We will use factory below to create an instance of campaign and assign it to the 'campaign' here. 

beforeEach(async () => { 
                accounts = await web3.eth.getAccounts();    //getting list of accoutns. Next line is a contract call but it doesnt try to locate location of contract. below we redeploying factory and campaign between every test run.
      factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) //deploying factory. factory here will be used to make instance of the campaigns.
                     .deploy({data: compiledFactory.bytecode})    //deploying indstance of CampaigFactory by using above 'compiledFactory'. We will use the 'Contract' constructor that is part of the above line 'web3.eth' library. Then we will pass in of compiled ABI/interface of line above 'compiledFactory'. Deploy it and send it out to the network. passing in our compiledFactory ABI. We have to change/parse the ABI from its JSON format to a javascript object. trying to deploy a new instance of our factory. .deploy() actually receives the exact bytecode we are tyring to deploy to the network. and we provide that in the data property. we are basically saying 'data' is compiledFactory.bytecode'.  
                     .send({from: accounts[0], gas: '1000000'});          //actual sending of the transaction. We have to sepcify which account is goign to attempt to deploy this-so we use accounts[0]-also pay attention we just fetched our accoutns a few lines above. We also have to specify the amount of gas we want to spend.   
                await factory.methods.createCampaign('100').send({        //using factory to make instance of campaign. calling the createCampagin func (from inside our Campaign.sol-totally different file!!! and it takes in one money arg) on our factory we just created above. anytime we call a func it has ti be asynchronus. referencig 'factory.methods' and specifically calling the createCampagin func-this func expects to take in the minum contribution. we are uisng wei measurement. we also have to specify whetere we acrea doing a call or a send to this func. we are trying to modify data insdie this contract. we r trying to deploy a new contract. we are sending a transaction because we are modifying data on the blockchain.   
                      from: accounts[0],                                     //specifying whom is sendin this transaction and amount of gas to use. managere at accounts[0]
                      gas: '1000000'
                      });
                 [campaignAddress] = await factory.methods.getDeployedCampaigns().call() //at this point in the code we have already created a campaign, now we have to get its location which that method had already been writtein inside Campaign.sol-getDeployedContracts. We are calling getDeployedCampaigs(this is a view(view means we are not changing any data) function) off of the factory.methods object. We are using call() since we are not changing any data to it. This call right here will return an array of addresses. [campaignAddress] is destructuring from an array. we are saying we want to take the first element out of the array that is being returned by this by this thing: away factory.getDepl.........-and assign it to the first [campaignAddress]. We are specifially taking out the firlst element becaues we are placing the [] around campaingA....
      campaign = await new web3.eth.Contract(                                   //creating acual instacne of the 'let campagin'. campaign already exists at our local blockchain at this point. telling web3 to write a javascript represntation of the contract and that representation needs to be trying to access the contract that exists at the address [campaignAddress]. So now we need to assign the result of this operation to the 'let campagin' var. So at the end 'let contract' will b the actual contract that we will be dealing with. This is our campaign instance-its accessible by any func on this test file.
                       JSON.parse(compiledCampaign.interface),//passing in 2 seperate args. first passing in our ABI/interface for our compiled campaign-which is kinda what we did w our factory about 8 lines above. So our ABI for our campaign is on the interface property of our compiledCampaign-since its in Json formatt we need to parse it/change it before we pass it into this func.
                       campaignAddress//we are gonna pass in the address: '[campaignAddress]' of where this 'let campagin' exists. This 'contract call' 2lines above seeks to locate contract address. 2nd arg here is the address/location of the already deployed version. Since this contract has already been deployed we dont have to run the .deploy() or .send from the other 'contract call' above: 'factory'.
                                      );
                                      }); //callbacks vs promises vs syn await- looks like sync await beats them all
describe('Campaigns', () => {                         //testing out 'let campaign' and 'let factory' to see that they were succesfully deployed-asserting that they both have an address to them. Testing Campaigns here 
            it('deploys a factory and a campaign', () => { //this is a warm up test to make sure our entire testing set up works
                  assert.ok(factory.options.address);
                  assert.ok(campaign.options.address);
                  });                                             //before we run our test we have to add a script to our pacckag.json file to run the mocha test runner. Under scripts: test
            it('marks callers as campaign managr', async () => {     //making sure that the person that creates the campagin is actually accounts[0] (createCampaing func on the factory,methods.createCampaign() several lines above)
                  const manager = await campaign.methods.manager().call();      //calling the manager method on the 'campaing' instacen soem lines abvove to compare it at [0]address. 'manager is being called from Campaign.sol under Request[] and its a 'public' address. We are not modifying the data here, we are retrieving the variable so no gas expense-call()-no gas , send()-gas cost   
                  assert.strictEqual(accounts[0], manager);             //after we retrieve address of manager, we can compare to accounts[0]. //starting up ganache local network takes a few secs when running ganache local netwrk. first arg is what we want it to be (accounts0,...) and 2nd arg (..., amanger)-what we want it to be.  
                       });                                              //whenever we make a public var inside of our contract it auto makes a get method in manager() since again we made it a public var at Campaign.sol      
            it('allows people to contribute money and marks them as approvers', async () => {    //making sure ppl are able to donate to our campaign(line 24) and become a contributor. we should use another account besides [0] to donate the money. Then we can see if that accounts gets marked as an approver inside our contract. This account wll come from our array accounts on line 15. Then we need to check that person got marked off as an approver. 
                  await campaign.methods.contribute().send({       //method attempting to contribute money to sthe campagaign. contribute() does not take any args to it, instead we send a value to send along w the transaction. 
                         value: '200',          //Also recall we have some minimum contribution level of 100 from line 21.
                         from: accounts[1]       // specifying whos is sending the transaction. this is the account that gets marked as the contributor. who gets marked as contributor. accounts is created for us by ganache and by default we get 10 different accounts generated.  
                         });   
                  const isContributor = await campaign.methods.approvers(accounts[1]).call();//approvers (public) meth from Campaign.sol-under Request[]- can help us check via mappging data structure and return us a bool to check if an account index has been marked as a contributor. approvers is the func that allows us to access the mapping. We have to pass in a key to approvers() to pull the account data from the mapping since we cannot retrieve an entire mapping. THe key will return is the value that corresponds to that key. Again we are lookinup data (call()) and not motifying it.
                  assert(isContributor);    //isContributor shoudl return us the true bool. assert will fail if we pass in a flasey val here.       
                    });  
            it('requires a minimum contribution', async () => {
                  try {
                      await campaign.methods.contribute().send({   //must place actual function call inside of try. we are expecting our code to skip the try and run the error. when we call contribute, we dont pass in the money that we want to send inside the (), but instead call '.send()'
                              value: '5',                  //in this object we specify value we want to send with transactioj 
                              from: accounts[1]                //this money is coming from accounts[1] 
                                          });
                                          //if this line is executed, then the test will auto fail
                                    } catch (err) {
                                         assert(err);       //just makeing sure that in fact we do have an error
                                        }//we will try to send less than the minimum contribution, then using the try-catch block to assert that in fact an error did occur.
                                        });
            it('allows a manager to make a payment request', async () => {           //testing to see if a managet has the ability to make a payment request
                 await campaign.methods          //calling func from Campaign.sol and oassing in its requirements
                 .createRequest('buy batteries','100', accounts[1])      //100 wei. we must pass all the args required. address here dont mean we gonna send money in-we just gotta provide an address in general                                              
                 .send({                        //.send({}) is going to attempt to modify the data of the contract so it will cost us money
                        from: accounts[0],   //we hav to specify whome is sending the transaction. the whole point of this 'it-block-test' is to chek if managr can make paymnt request
                        gas: '1000000'
                             });                                       //next line is going to return our request. this of accounts() working with Request struct
                        const request = await campaign.methods.requests(0).call();   //every time we send a transaction to a func we get no value back, so now we have to reach back into our contract after this transaction has been created and pull out the request that was just made. Because its marked 'public' back at Campagaing.sol on the line of Request[]-that means we atuo get a requests func created for us. So we are grabbign that request that was just created with 'const request = ....'    'requests()' is our automatic 'array-getter' that gets created at Campaign.sol on line of Request[]. Next we need to specify the index we want to retrieve from it. '.call()' not modifying data.                                
                        
                        assert.strictEqual('buy batteries', request.description);                    //we dont necessarily have to make an assertion of everythign but we will mak one assertion of the desctiption. We want description to be equal to 'buy battieries', 2md arg is the actuial value: request.deescription-so these 2 args will compare against each other?
                        });                                //array getters funcs that are synthesized for us are only used to retrieve one element at at time.         
            it('processes requests', async () => {
                  await campaign.methods.contribute().send({  //first thing we need to do is contribute some amount of money to our campaign. 
                        from: accounts[0],
                        value: web3.utils.toWei('10', 'ether')  //whenever we want to send ether instead of wei, we need to specify web3. here we saying we want to convert 10 ether to wei. This 10 ether is being sent to the contract.
                        });
                  await campaign.methods  //not that money has been contributed, we can now try to send to another party/vendor?
                  .createRequest('Test A', web3.utils.toWei('5', 'ether'), accounts[1]) //takes in 3 args: desc, money, and receiving party. Of the 10 ether     
                  .send({ from: accounts[0], gas: '1000000' });

                 await campaign.methods.approveRequest(0).send({ //but before we send of this request we have to finalize it and vote on this thing. so we have to make an attempt to call our approveRequest method. We use index 0 because we only created one request-otherwise wev had to specify the index. 
                       from: accounts[0], 
                       gas: '1000000' 
                       }); 
                 await campaign.methods.finalizeRequest(0).send({ //just as b4 we gota pass in the index we are trying to finalize-0. we are sending that info in. 
                       from: accounts[0],  // we are using manager here because in theory the manager is the only one authority to finalize the request
                       gas: '1000000'     //what finalizeRequest does is disburse the money from the contract over to accouns[1]
                       });  
                 let balance = await web3.eth.getBalance(accounts[1]);   //last step is the check if accoutns[1] got the extra ether delivered. so we gonna retrieve the balance of that account[1]. we can retrieve any account on the netwrk w getBalance()'. this will return a string, then we gotta turn into ether then turn it into an actual number that we can use to malke a comparison. using let because we gonna do some reassignment of balance. balance is a string that represents the amoutn of money acounts[1] has in wei. 
                 balance = web3.utils.fromWei(balance, 'ether');//taking the balance and turn it into ether . 2nd arg we specify that we want to have ether.      
                 balance = parseFloat(balance); //strings arent easy to compare so gonna turn it inot a float. parseFloat tries to turn its arg into a decimal number
                 console.log(balance);
                 assert(balance > 104 );//asertign that accouns[1] should have a greater amount of number for testgin purposes. due to ganache limitations-its a bit diifficult to know how much ether accounts[1] has-for example a prior test could have wiped out all the ether from accounts[1]
            }); //remember back in our Campagin.sol, Request is a struct and a struct is a collection of key value pairs. 

});