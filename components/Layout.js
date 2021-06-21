import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';   //html header
import Header from './Header';


const Layout = (props) => {        //our functional components get called with the props arg
                        return(
                            <Container>
                                    <Head>
                                            <link
                                        rel="stylesheet"
                                        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
                                            />
                                    </Head>
                                <Header />
                                    {props.children}        {/*  this is the jsx that came from index.js inside the Layout tags.  */}  
                            </Container>
                        );
                    };

export default Layout;

//Campaign list shoudl be a child of Layout.