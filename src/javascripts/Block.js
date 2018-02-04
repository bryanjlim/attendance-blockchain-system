import Timestamp from './Timestamp';
const SHA256 = require('crypto-js/sha256');

export default class Block
{
    constructor(name, asbnumber, club, grade, timestamp, previousHash, hash)
    {
        this.name = name; 
        this.asbnumber = asbnumber;
        this.club = club;
        this.grade = grade; 
        this.timestamp = timestamp;
        this.previousHash = previousHash; 
        this.hash = hash; 
    }

    calculateHash()
    {
        //alert(SHA256(this.name + this.asbnumber + this.club + this.grade).toString());
        return SHA256(this.name + this.asbnumber + this.club + this.grade).toString();
    }
}