const { createServer } = require('http');
const next = require('next');  //next library

const app = next({//creating app instance and passing in a configuration obejct. dev flag. dev property. we will pass a configuraton object into this thing. flag specifies whethere we are runniung our server in production or development mode  
      dev: process.env.NODE_ENV !== 'production'   //NODE_ENV is a global variable 
      });
      
const routes = require('./routes');         //nav logic
const handler = routes.getRequestHandler(app);   //more nav stuff. passing in the app object

app.prepare().then(() => {    //setting up app and telling it to listen to a specific port
    createServer(handler).listen(3001, err => {    //passing in the handler we just created
    if (err) throw err;
    console.log('Ready on localhost:3001');
    });                      
    });