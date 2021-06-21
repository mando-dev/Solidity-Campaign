import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';  
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout'
import factory from '../../ethereum/factory';   //importing instance of factory from solidity file
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';    //importing 2 seperate helpers from routes.j. Link object is a React compontn that allows us to render anchor tags into our React components and lets us navigate aroudn the app. Router obejct lets us programatically redirect people inside of our app from one page to another. We want to use Router aftwe we create campaign. so after user creates campaign he should be redirected to diffrnt page


class CampaignNew extends Component { 
       state = {                 //initliazing our state compoenent. this is a state object. we can introduce properties to our state object. 
                minimumContribtion :  '',              //this is going to record whatever our user is ty[ing into our input value here. convertin user number input unto string. 
                errorMessage: '',  
                loading: false     //defaulting to false   
               }; 

                onSubmit = async (event) => {   //event/submit handler. we will pass in evern. 
                            event.preventDefault();               //   the browser is going to automatically try to submit the form to our backedn server-we actually dont want this behaviro. this keeps browser from submitting form. this is an event object. 
                            
                            this.setState({loading: true, errorMessage: '' });    //spinner-telling user to wait for loading. 2nd arg clears out error message after state has changed once user creates campaign
                                    try{
                                    const accounts = await web3.eth.getAccounts();        //gettin list of accounts
                                    await factory.methods
                                    .createCampaign(this.state.minimumContribtion)          //actually attempting to crate a new campaign. we can create a new campaign by creating importing our factory instance. users will per for this transaction according to solidty contract. importing above factory instance .whenever we call a func on a contract its alaways going to be async in nature. we are grabbign our mininmumContribution from our state
                                    .send({
                                        from: accounts[0]                                                 //calling this func in the browswer. we have to specify source account for sending this transaction in. metamask will specify gas amount. we only need to specify gas cost when we running test on our own. getting our list of accounts from web3 and use the first account on that list to send the transaction in. assuming user has at least one account to send in the transaction
                                        });  
                                            Router.pushRoute('/');  //this is immediately after we successfuly create our contract we then want to redirect our user to our index.js 
                                                } catch (err) {
                                                    this.setState({errorMessage: err.message});//getting content on our component. message is string to be safely printed to component
                                                    }       
                                                        this.setState({ loading: false });//finishing off the spinner
                                                            }; 
                                                    
                            
                                render() {  //as third step of state property 'errorMessage', we wanted to display somewhere in render. 
                                        return (
                                            <Layout>
                                                <h3> Create A Campaign </h3>
                                                        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}> {/*  when user submits form, we will try to crate a campaign by using our factory contract. 2nd we gotta pass in our submit handler. Referencing onSubmit and not necessarily running it every time and this is why we dont add the parantheeses. error property here was injected due to Message component requirement. According to our state this is an emmpty string. an  */}
                                                            <Form.Field>
                                                                    <label>Minimum Contribution</label>
                                                                    <Input 
                                                                        label="wei" 
                                                                        labelPosition="right"
                                                                        value={this.state.minimumContribtion}            //value property. this is where we take our state value of minimumContribiution and push it back into the Input component. 
                                                                        onChange={ event => this.setState( {minimumContribtion: event.target.value} ) } //this event handler will update state anytime user updates value line above. this wil be called with an event object
                                                                    />
                                                            </Form.Field>
                                                                    <Message error header="Oops!" content={this.state.errorMessage} />
                                                                        <Button loading={this.state.loading} primary > Create !</Button>
                                                        </Form>
                                              </Layout>
                                        );
                                    }
                                }

    export default CampaignNew;
    //Whenever we want to handle some user input inside a React component, a piece of state holds the value that user is entering. So whenever a user inputs text we are going to update our state, whenever we update our state, that causes our component to rerender, then the new text will reappear
   //npm install next-routes --legacy-peer-deps if you see any errots when downloadin next-routes

