import Timestamp from './Timestamp';
const SHA256 = require('crypto-js/sha256');

export default class Block
{
    constructor(name, club, grade)
    {
        this.timestamp = new Timestamp();
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