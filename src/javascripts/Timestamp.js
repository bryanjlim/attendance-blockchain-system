export default class Timestamp
{
    constructor(day, month, year)
    {
        this.day = day; 
        this.month = month;
        this.year = year; 
    }

    setCurrentTime(){
        var date = new Date(); 
        this.day = date.getDate(); 
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear(); 
    }

    toString(){
        return this.month + "/" + this.day + "/" + this.year; 
    }
}