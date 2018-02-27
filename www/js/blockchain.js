class Block
{
    constructor(name, asbNumber, club, grade, timestamp, previousHash, hash, paragraph, boolean, email, date)
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
        this.email = email; 
        this.date = date; 
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
                alert("Current Hash Mistmatch At Index" + i);
                return;
            }

            if(currentBlock.previousHash !== previousBlock.calculateHash()){
                alert("Previous Hash Mistmatch At Index" + i);
                return;
            }
        }
        alert("Success! The Blockchain is Valid.");
        return; 
    }
}