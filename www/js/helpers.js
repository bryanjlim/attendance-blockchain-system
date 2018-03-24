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
var attendancedata = []; 
updateAttendanceData(); 

// Updates variable attendancedata 
function updateAttendanceData(callback)
{	
    databaseRef.once("value", function(snapshot)
    {
		var newattendancedata = [];
        snapshot.forEach(function(data){
                var hour = data.val().timestamp.hour == undefined ? 0 : data.val().timestamp.hour; 
                var minutes = data.val().timestamp.minutes == undefined ? 0 : data.val().timestamp.minute; 
                var totalMilliseconds = data.val().timestamp.totalMilliseconds == undefined ? 0 : data.val().timestamp.totalMilliseconds; 
                var block = new SignInEntry(data.val().name, 
                                        data.val().asbNumber, 
                                        data.val().club, 
                                        data.val().grade, 
                                        new Timestamp(data.val().timestamp.day,data.val().timestamp.month,data.val().timestamp.year, hour, minutes, totalMilliseconds), 
                                        data.val().paragraph,
                                        data.val().boolean,
                                        data.val().email,
                                        data.val().date
                                    );
                    newattendancedata.push(block);
        })
		attendancedata = newattendancedata;	
		if(callback != null){
			callback();
		}
    })
	
} 

// Adds singular sign in entry to database
function addSignInEntryToDatabase(signInEntry){
    databaseRef.push(signInEntry);
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

// Date helpers
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
Date.prototype.getFormattedDate = function() {
	return formattedDate = '"' + months[this.getMonth()] + " " + this.getDate() + ", " + this.getFullYear() + " (" + days[this.getDay()] + ")" + '"';
}