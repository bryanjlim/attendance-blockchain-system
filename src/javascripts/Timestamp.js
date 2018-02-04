export default class Timestamp
{
    constructor()
    {
        var date = new Date(); 
        this.day = date.getDate(); 
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear(); 
    }

    toString(){
        return this.month + "/" + this.day + "/" + this.year; 
    }
}