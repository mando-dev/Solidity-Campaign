import Web3 from 'web3';                                              //Web3 is a constructor because its capitalized.  // const web3 = new Web3(window.web3.currentProvider);//we will use the contstuctor above to make an instance of web3 and we are going to give it the provider that is already provided to us from metamask. 

let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {    //code executed at the browwer and metamask is available. this is if statement is checking if we are running at the browser. here making sure both statuses are 'undefined'. Chekcing to see if we are on the browser or the server. 2nd condition  checking to see if mete
    window.ethereum.request({ method: "eth_requestAccounts" });                    // if above line is true, then we want to hijack metamask provider and cretae our own instance of web3 and assign it to our let web3 var. We cannot rely on whatever version of web3 Metamask is inejcting. 
    web3 = new Web3(window.ethereum);                                               //here is where the hijacking is happening.Taking in the copy of web3 that was injected by metamask: we are hijakcing provider from web3 and creating our own instance of web3. We are doing all this so we know we are always using the same version of web3.
           } else {                                                                 // on the other hand this is handling the other possible situation if we are on the server *OR* the user is not running metamask
                  const provider = new Web3.providers.HttpProvider(                 //we are setting up our own provider that connects to Rinkeby via infurra. We use infura to access Rinkeby through our deployment script. 
                  "https://rinkeby.infura.io/v3/9fe59de2457e482ba05207c5dadc5dfd"   //setting up our provider taht works via infura and seeting it to our web3 instance on line above. This long hexadecimal is the access key.
                   );                                                               //making our own provider on line above. This url is a remote node that we have access to (infura). Infura is a portaal computer into rinkeby. 
           web3 = new Web3(provider);                                                      //createing our last intance of web3 again. 
           }

export default web3; //exportin new instance 'web3'. In line above we assumunint that metamask has already injected a web3 instance unto the page. Not all users will be using metamask. (we will come back to this later) 

//window is a global var that is only availabel in the browser. window is not available on nodeJS which is where our server is currently running. NextJS is a server side rendering tool. 
//This file here gets exexuted twice: once on server (global window var will not be defined) to initially render our application and once on browser. So we have to make sure this code can get both executed on server or browser. 