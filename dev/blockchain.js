const sha256 = require('sha256');

function Blockchain(){
	this.chain = [];
	this.pendingTransactions = [];

	this.createNewBlock(100 , '0' , '0');
}

Blockchain.prototype.createNewBlock = function(nonce , previousHash , hash){
	const block = {
		index : this.chain.length + 1,
		timestamp : Date.now(),
		transaction : this.pendingTransactions,
		previousHash : previousHash,
		hash : hash,
		nonce : nonce
	}

	this.pendingTransactions = [];
	this.chain.push(block);

	return block;
}

Blockchain.prototype.getLastBlock = function(){
	return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount , sender , receiver){
	const newTransaction = {
		amount : amount,
		sender : sender,
		receiver : receiver
	}

	this.pendingTransactions.push(newTransaction);

	return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash , currentBlock , nonce){
	var dataToString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlock);
	return sha256(dataToString);

}

Blockchain.prototype.proofOfWork = function(previousBlockHash , currentBlock){
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash , currentBlock , nonce);
	while(hash.substring(0,4) !== '0000'){
		nonce++;
		hash = this.hashBlock(previousBlockHash , currentBlock , nonce);
	}
	return nonce;
}
//15682

module.exports = Blockchain;