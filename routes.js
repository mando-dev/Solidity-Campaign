const routes = require('next-routes')(); //this returns a func ()

routes  
    .add('/campaigns/new','/campaigns/new')   //its very important in what order you list your routes because for example the row below can override this route simply because row below will think this route is also a wildcard.
    .add('/campaigns/:address','/campaigns/show');   //routes we want to have inside our application. //settgin up the routing rule. the add() func is how we define a new route mapping. first arg is the pattern we want to look for- a wildcard. wilcard = ':address'. address is just a name we created here first. 2nd arg is to show whcih Component do want to show from our 'pages directory whenver someone is directed to the first arg   
    

module.exports = routes;   //will export some helkpers to help users navigate on our app. purpose of server.js is so server.js it tells routes.js to run but we gotta run manually server.js. this is a routes object. 





//here we set dynamic routes, routes contains helpwerrs to automatically navigate our users around,  also  is generat link tags inside to display inside our React components 