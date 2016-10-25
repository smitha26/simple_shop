//This is my simple sample app in vanilla express and javascript
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const session = require('express-session');
//Create the express app ();
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
//set the database to shortcut db

//Create a simple shortcut way to access the database
MongoClient.connect('mongodb://smithaG:sgki2345@ds019866.mlab.com:19866/simple_shop', function(error, database) {
    //Make sure there are no errors connecting with the db
    if (error != null) {
        throw error;
        return;
    }

    db = database;
    console.log('Succesfully connected to database')
    //Create a server that will process the requests
    app.listen(5000, function() {
        console.log('My app server is running on local host 3000')
    })

})

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');
//Tell express where the public static content is at
app.use(express.static('public'));
//Set up the session for use by expres

app.use(session({
    secret: 'keyboard cat', //used to salt the hash
    //keep the session
    resave: false,
    saveUninitialized: true
}))



app.get('/', function(request, response) {
    response.render('index.ejs');

});

app.get('/login', function(request, response) {
    response.render('login.ejs');
});

app.get('/error', function(request, response) {
    response.render('error.ejs');
});
app.get('/signup', function(request, response) {
    response.render('signup.ejs');
});

app.get('/admin', function(request, response) {
    var user = request.session.user;
    if (user && user.admin){
    // if (user){
        response.render('admin.ejs', {user:user});
    }else{
        response.render('error.ejs');
    }
});

app.get('/logout', function(request, response){
    request.session.destroy ();
    //request.session = null;
    response.redirect ('/login');
});

app.get('/profile', function(request, response) {
    //var user = app.get('user');
    var user = request.session.user;
    // console.log(app.get('user'));
    response.render('profile.ejs', {user: user});

});
//create a route to handle quote post request
app.post('/login', function(request, response) {
    console.log('--------')
    console.log('form data: ',request.body);
    //var cursor =
    db.collection('users').findOne(
        {
            username: request.body.username,
            password: request.body.password
            // password: request.body.password
        },
        function(error, user){
            console.log('database result:', user);

            if (!user){
                response.redirect('/error');
            }else
            //User found log user in system
            //save the user to the session
            {
                //app.set ('user', result);
                request.session.user = user;
                if (user.admin) {
                    response.redirect ('admin');
                }else {
                    response.redirect('/profile')
                }


            }
        }
    );


});

//------------------------------------------------------
//Products
app.get('/product', function(request, response){
    //pull all the product items from data base
    //var productList =
    db.collection('products').find().toArray (function(error,resultList){

        // console.log(resultList)
        if (error){
            throw error;
            response.redirect('/error');
        }
        else
        {
            var item = resultList [0];
            // console.log('item id: ', item._id);


    response.render('product-list.ejs', {
        name: 'ron bravo',
        city: 'phoenix',
        productList: resultList
    })
    }
});
});


app.get('/cart/add/:id', function(request, response){
console.log('Item added by id: ' + request.params.id);
var objectId = request.params.id;

db.collection('products').findOne (
    {
        name: objectId
    },
    {},

    function(error, resultList){
        if (error) {
            throw error;
            response.redirect('/error');
        }
        //check if we have a shopping cart in the session
        var cart = request.session.cart;
        //if no cart exsist, create new cart
        if (!cart){
            cart = {
                total:0,
                itemList: []
            };
            request.session.cart = cart;
        }

        //Grab the item from the result list
        var item = resultList;
        //Add price to total
        cart.total = cart.total + item.price;
        //Add the product to the cart
        cart.itemList.push (item);
        //Respond with a simple message
        console.log('----------------------')
        console.log('result list: ', resultList);
        console.log('cart: ', cart);
        console.log('');
        //response.send('done');
        response.redirect('/cart');
    }
);
});

app.get('/cart', function(request, response){
    var cart = request.session.cart;

    if (!cart) {
        cart = {
            total: 0,
            itemList: []
        }
        request.session.cart = cart;
    }
    response.render('cart.ejs', {cart:cart});
});

app.get('/clear', function(request, response){
    request.session.destroy ();
    //request.session = null;
    response.redirect ('/cart');
});

app.get ('/cart/remove/:index', function(request, response){
    console.log('remove item by index: ' , request.params.index);
    var cart = request.session.cart;
    if (cart){
    var index = request.params.index;
    var price = cart.itemList [index].price;
     cart.total = cart.total - price;
    //console.log(price);
   //  console.log('Array:',cartArray);
    var index = request.params.index;
     console.log(index);

   var removeditem = cart.itemList.splice(index, 1);
     console.log('removeditem: ', removeditem);
     response.redirect('/cart');
   cart.total = cart.total - price;
   //  console.log('cart total: ' ,cartArray.total)
    // var price = cart.itemList [0].price;
    // cart.total = cart.total - price;
    // console.log ('-Testing...', cart.total);
}
});

app.get('/template', function(request, response) {
    response.render('template.ejs');

});

app.get('/cart/confirm', function(request, response) {
    response.render('confirm.ejs');
});

app.get('/cart/pay', function(request, response) {
    response.render('pay.ejs');
});

app.get('/cart/summary', function(request, response) {
    response.render('summary.ejs');
});


// app.get('/cart/add/:id', function(request, response){
//     db.collection('products').findOne ({_id: request.params.id} , function(error, resultList){
//         if (resultList){
//             console.log(resultList._id);
//         }else{
//             console.log('no match');
//         }
//     });
//     //     console.log('result list: ', resultList);
//     //     request.send('done')
//     }
//     // console.log('Item added by id: ' + request.params.id);
//     // response.redirect('/product');
//     // response.send('Item added by id: '+ request.params.id);
// });
