const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const blockchain = require('./dev/blockchain');

const b = new blockchain();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}));

app.get('/transaction' , function(req , res){
	res.send(`Amount: ${req.body.amount}`);
});

app.get('/blockchain' , function(req, res ){
	res.json(b);
});

app.get('/mine' , function(req , res){

});

app.listen(port , function(){
	console.log(`Server started at ${port}`);
})