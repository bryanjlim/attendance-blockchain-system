import Timestamp from './Timestamp';
const SHA256 = require('crypto-js/sha256');

export default class Block
{
    constructor(name, asbNumber, club, grade, timestamp, previousHash, hash)
    {
        this.name = name; 
        this.asbNumber = asbNumber;
        this.club = club;
        this.grade = grade; 
        this.timestamp = timestamp;
        this.previousHash = previousHash; 
        this.hash = hash; 
    }

    calculateHash()
    {
        return SHA256(this.name + this.asbnumber + this.club + this.grade).toString();
    }
}