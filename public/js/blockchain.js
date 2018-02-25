class Block
{
    constructor(name, asbNumber, club, grade, timestamp, previousHash, hash, paragraph, boolean)
    {
        this.name = name; 
        this.asbNumber = asbNumber;
        this.club = club;
        this.grade = grade; 
        this.timestamp = timestamp;
        this.previousHash = previousHash; 
        this.hash = hash; 
        this.paragraph = paragraph;
        this.boolean = boolean; 
    }

    calculateHash()
    {
        return Sha256.hash(this.name + this.asbNumber + this.club + this.grade).toString();
    }
}

class Blockchain
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