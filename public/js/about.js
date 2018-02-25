$("#verify").click(function(e){
    var blockchain = new Blockchain(); 
    blockchain.chain = blockchainarray; 
    blockchain.verifyBlockchain();
});