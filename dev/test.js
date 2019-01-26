const Blockchain = require("./blockchain");

const b1 = new Blockchain();
const previousHashBlock = "ojenc934n039nc92ub3f";
const currentData = [{
	amount:40,
	sender : "cnywg4f97c9820e9j2",
	receiver : "cmiyrbc9293-fj30f3"
},{
	amount:50,
	sender : "cnywg4f97c9820e9j2",
	receiver : "cmiyrbc9293-fj30f3"
},{
	amount:60,
	sender : "cnywg4f97c9820e9j2",
	receiver : "cmiyrbc9293-fj30f3"
},
];
var res = b1.proofOfWork(previousHashBlock , currentData );

console.log(res);