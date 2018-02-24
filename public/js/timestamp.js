class Timestamp
{
    constructor(day, month, year, hour, minutes, totalMilliseconds)
    {
        this.day = day; 
        this.month = month;
        this.year = year; 
        this.hour = hour;
        this.minutes = minutes; 
        this.totalMilliseconds = totalMilliseconds; 
    }

    setCurrentTime(){
        var date = new Date(); 
        this.day = date.getDate(); 
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear(); 
        this.hour = date.getHours(); 
        this.minutes = date.getMinutes(); 
        this.totalMilliseconds = date.getTime(); 
    }

    toString(){
        return this.month + "/" + this.day + "/" + this.year + " ("+this.hour+":"+this.minutes+")"; 
    }

    getSimpleDate(){
        return this.month + "/" + this.day + "/" + this.year; 
    }
}