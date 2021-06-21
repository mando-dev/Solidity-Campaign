import React, {Component} from 'react';                                                         //we gonna use factory instance to get list of all deployed addresses an use React component to dispplay them on the screen
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';                                                       //importing factory instance which was created inside factory.js
import Layout from '../components/Layout';                                                     //right after we imported this we used it on the render method below
import { Link } from '../routes';

class CampaignIndex extends Component {                                                         //we now need location to fetch data from factory by calling getDeploydedCamapgins from our factory instance imported above. This is class based component- so when we do that we can use of the life cycle method componentDidMount which is a good place to load up some data inside a React component.Once we do data loading then we can render that data out for user to see/interact. Name of class was randomly picked. 
      static async getInitialProps() {                                                          //think of getInitialProps as method to load data in its server so it can be qucikly passed on to componentDidMount. static defines a class func. We dont have to create instance when using getInitialProps, we can just say CampaignIndex.getInitialProps(). Basically NextServer tries to avoid rendering a component and just calling that one func in order to be more efficient. 
                   const campaigns = await factory.methods.getDeployedCampaigns().call();               //calling our factory instance that we imported above to call our getDelpoyedCampagains func. This will return array of all deplyed campaigs. magic!
                         return { campaigns };                                                        // from getInitialProps we are gonna return an object and and that object is goint to b provided tp our class CampaignIndex as props. VERY IMPORTANT.  
                         } 
                              renderCampaigns() {                                                          //func that cretes the card group component. adding this func to our CaomgainIndex component. 
                                              return this.props.campaigns.map(address => {                 //iterating through campaign addresses and for every different address we will create a different object. iterating over campaigns using mapping
                                                  return (                                                //assembling one individual object to represent one individual card.
                                                      <Card key={address}
                                                            header={address}                                //header property
                                                            fluid={true}                                    //fluid property CSS styyling
                                                            extra={(                                        //extra property
                                                                <Link
                                                                    route={`/campaigns/${address}`}>
                                                                    <a>View Campaign</a>
                                                                </Link>
                                                            )}
                                                      />
                                                  );
                                                });
                              }                                                                     //this is how map() works: we pass a func into map(), then that func will b called once for every element inside the array 'campaigns', that fun also gets called once which every element in the array, and whatever we return from that inner func will eventually be assigned to the items var
                                          render() {                                                                     //jsx. calling func from our render methd. 
                                                return (    
                                                     <Layout>
                                                     <div>                                                              {/*all this interior jsx will get passed as children to Layout */}
                                                            <h3>Open Campaigns</h3>
                                                                  <Link route="/campaigns/new">
                                                                        <a> 
                                                                        <Button floated="right"
                                                                              content="Create Campaign"                                                       //propterty vs arg
                                                                              icon="add circle"                                                          //look into docs for different icons if u wish
                                                                              primary                                                                             //property vs arg
                                                                        />
                                                                        </a>  
                                                                  </Link>
                                                            {this.renderCampaigns()}   
                                                       </div>                                        
                                                   </Layout>
                                                                          //this is the object we have access to from the 'return { camapaings} above. 'campaigns' is a property, this will b our array of addressses. 
                                                );
                                       }                                                                                       //we are using the Component based calss here from the React librarby
                              }
export default CampaignIndex;                                                                   //exporting the component since Next expects an export

//anytime we want to access data from the Ethereum network we need to use web3 and we need to set up a provider with it.
//metamask auto inejcts a provider to our page whenever it runs. We will give web3 2 things: our factory contrract interface and address where factory was deployed on rinkeby. This will return a contract instance that we can manioulate inside of our application. With that factory instance we will be able to display all campaigns overtime. 
// provider given by metamask. creating new instance if web3. this page is intended where we display a list of all our campagains deployed at rinkeby by the campagign factory?.
//in this file we are going to want to access our factory intance to get list of deployed contracts. 
//In server side rendergin- for example in React, our Components will be attempted to be deployed at the server and immdediately load html to browser without JS code, JS code comes after. 
//getInitialProps is a life cycle method that we are gonna use since when Next is running on the server, its not reall loding componentDidMount. So if we want Next to do some data fetching from Rinkeby, it wont be able to load that data onto componendDidMount, and thus we are using getInitialProps to nake sure that data loads unto componentDidMount.
//getInitialProps is a lifecycel exclusively used by NextJS/server. 