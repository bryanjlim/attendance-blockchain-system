// Firebase
var config = {
    apiKey: "AIzaSyDLrLyawb7-sC86nPa_Y4c4U07oI4gD7bk",
    authDomain: "issaquah-attendance-bloc-c0c08.firebaseapp.com",
    databaseURL: "https://issaquah-attendance-bloc-c0c08.firebaseio.com",
    projectId: "issaquah-attendance-bloc-c0c08",
    storageBucket: "issaquah-attendance-bloc-c0c08.appspot.com",
    messagingSenderId: "706537935134"
}
firebase.initializeApp(config);
var databaseRef = firebase.database().ref();

// Blockchain array
var blockchainarray = []; 
updateBlockchain(); 

// Updates variable blockchainarray 
function updateBlockchain()
{
	
    databaseRef.once("value", function(snapshot)
    {
		blockchainarray.length = 0;
        snapshot.forEach(function(data){
                var hour = data.val().timestamp.hour == undefined ? 0 : data.val().timestamp.hour; 
                var minutes = data.val().timestamp.minutes == undefined ? 0 : data.val().timestamp.minute; 
                var totalMilliseconds = data.val().timestamp.totalMilliseconds == undefined ? 0 : data.val().timestamp.totalMilliseconds; 
                var block = new Block(data.val().name, 
                                        data.val().asbNumber, 
                                        data.val().club, 
                                        data.val().grade, 
                                        new Timestamp(data.val().timestamp.day,data.val().timestamp.month,data.val().timestamp.year, hour, minutes, totalMilliseconds), 
                                        data.val().previousHash, 
                                        data.val().hash,
                                        data.val().paragraph,
                                        data.val().boolean,
                                        data.val().email,
                                        data.val().date
                                    );

              //  if(!blockchainarray.includes(block))
              //  {
                    blockchainarray.push(block);
              //  }
        })
    })
} 

// Adds singular block to database
function addBlockToDatabase(block){
    databaseRef.push(block);
}

// Geolocation
var longitude = parseFloat(this.httpGet("https://ipapi.co/longitude/")); 
var latitude = parseFloat(this.httpGet("https://ipapi.co/latitude/")); 
    
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


function getGenderFromName(name)
{
    var result = httpGet("https://api.genderize.io/?name="+name);

    if(result != null)
    {
        var splitResult = result.split(","); 
        if(splitResult[1] != null)
        {
            var genderString = splitResult[1]; 
            var genderSplit = genderString.split(":");
            if (genderSplit[1] == '"male"')
            {
                return "male"; 
            } 
            else if (genderSplit[1] == '"female"')
            {
                return "female"; 
            }
            else
            {
                return null; 
            }
        }
        else
        {
            return null; 
        }
    }    
    return null; 
}
