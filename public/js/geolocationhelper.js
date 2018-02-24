export default class GeolocationHelper
{
    constructor()
    {
        this.longitude = parseFloat(this.httpGet("https://ipapi.co/longitude/")); 
        this.latitude = parseFloat(this.httpGet("https://ipapi.co/latitude/")); 
    }

    httpGet(theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }
}
