const SHA256 = require('crypto-js/sha256');

export default class Block
{
    constructor(timestamp, name, club, grade)
    {
        this.timestamp = timestamp;
        this.name = name; 
        this.club = club;
        this.grade = grade; 
        this.previousHash = ''; 
        this.hash = this.calculateHash(); 
    }

    calculateHash()
    {
        return SHA256(this.previousHash + this.timestamp + this.name + this.grade + this.club).toString();
    }

}