const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const blockchain = require('./dev/blockchain');
const uuid = require('uuid/v1');

const nodeAddress = uuid().split('-').join('');

const b = new blockchain();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}));

app.post('/transaction' , function(req , res){
	const blockIndex = b.createNewTransaction(req.body.amount ,req.body.sender ,req.body.receiver);
	res.send(`Block created at ${blockIndex}`);
});

app.get('/blockchain' , function(req, res ){
	res.json(b);
});

app.get('/mine' , function(req , res){
	const lastBlock = b.getLastBlock();
	const previousHashBlock = lastBlock['hash'];
	const currentData = {
		transactions : b.pendingTransactions,
		index : lastBlock['index'] + 1
	};
	const nonce = b.proofOfWork(previousHashBlock , currentData);
	const blockHash = b.hashBlock(previousHashBlock , currentData , nonce);

	b.createNewTransaction(12.5 , "00" ,nodeAddress);

	const newBlock = b.createNewBlock(nonce , previousHashBlock , blockHash);
	res.json({
		note : "Block mined suucessfully",
		block : newBlock
	});
});

app.listen(port , function(){
	console.log(`Server started at ${port}`);
});