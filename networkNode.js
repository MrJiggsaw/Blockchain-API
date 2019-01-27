const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.argv[2];
const blockchain = require('./dev/blockchain');
const uuid = require('uuid/v1');
const rp = require('request-promise');

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

app.post('/register-node' , function(req ,res){
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = b.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = b.currentNodeUrl !== newNodeUrl;
	if(nodeNotAlreadyPresent && notCurrentNode){
		b.networkNodes.push(newNodeUrl);
	}
	res.json({
		note : "Node registered successfully"
	});
});

app.post('register-and-broadcast-nodes' , function(req, res){
	const newNodeUrl = req.body.newNodeUrl;
	if(b.networkNodes.indexOf(newNodeUrl) == -1){b.networkNodes.push(newNodeUrl);}
	
	const regNodesPromises = [];
	b.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri : networkNodeUrl + '/register-node',
			method : "POST",
			body : {newNodeUrl : newNodeUrl},
			json : true
		};
	regNodesPromises.push(rp(requestOptions));
	});
	Promise.all(regNodesPromises)
	.then(function(data){
		const bulkRegisterNodes = {
			uri : newNodeUrl + "/register-nodes-bulk",
			method : "POST",
			body : {allNetworkNodes : [ ...b.networkNodes ,b.currentNodeUrl]},
			json : true
		}
	}).then(function(){
		res.json({
			note : "Node registered successfully" 
		})
	})
});

app.post('register-nodes-bulk' , function(req, res){

});

app.listen(port , function(){
	console.log(`Server started at ${port}`);
});