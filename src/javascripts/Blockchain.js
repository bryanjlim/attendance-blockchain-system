import Block from './Block';
require('./Block');

export default class Blockchain
{
    constructor()
    {
        this.chain = []; 
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length - 1]; 
    }

    verifyBlockchain()
    {
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false; 
            }

            if(currentBlock.previousHash !== previousBlock.calculateHash()){
                return false; 
            }

            return true;
        }
    }
}