// Variables for submission
var nameToSubmit=""; 
var emailToSubmit=""; 
var asbNumberToSubmit=""; 
var clubToSubmit=""; 
var gradeToSubmit=""; 
var paragraphToSubmit="";
var dateToSubmit=""; 
var booleanToSubmit=""; 
var timestampToSubmit="";
var previousHashToSubmit=""; 
var hashToSubmit="";

var signInFieldDefault = $(".entireSignInFields").clone().html();
// Bind hashchange to onHashChange function
$(window).on('hashchange', onHashChange);

// Check hash on startup
onHashChange(); 


// Override hashchange function (When this code makes a hashchange)
var override = false;

 function onHashChange(){
// Load correct page
	if(!override){
		if(window.location.hash == ""){
			if($('#entireClubSelection:visible').length < 1){ // On club sign in page, but no hash
				window.location.reload(); // Reload page to get back to entire club selection
			}
		} else {	
			$("#entireClubSelection").hide();	
			$(".entireSignInFields").empty();
            $(".entireSignInFields").html(signInFieldDefault);
			clubToSubmit = window.location.hash.replace("#", "");
			generateClubFields(clubToSubmit);
			
			$(".entireSignInFields").show(); 
		}
	} else {
		// Reset override (use once)
		override = false;
	}
}

// On club selection from list
$('#entireClubSelection').on('click', '.clubLink', function(e)
{
	selectClub($(this).attr('shorthand'));
	// Animate selection
	$("#entireClubSelection").hide(250); 
	$(".entireSignInFields").show(250); 
});

$('#selectClubForm').submit(function(e){
	e.preventDefault();
	selectClub(search());
	// Animate selection
	$("#entireClubSelection").hide(250); 
	$(".entireSignInFields").show(250); 
	return false;
});

// Only allow one club to be selected from the list
var selected = false;

// Select club and animate selection
function selectClub(club){
	if(!selected) {			
		clubToSubmit = club;

		// Make sure club is only selected once.
		selected = true;
		
		// Code is making hashchange. Override hashchange function.
		override = true;
		
		// Set hash to club shorthand
		window.location.hash = clubToSubmit;
		
		// Generate selection fields for selected club
		generateClubFields(clubToSubmit);
	}
}

// Generate selection fields for selected club
function generateClubFields(clubToSubmit){
	for(let i=0; i<clubList.length; i++)
	{
        if(clubList[i].shortHandName == clubToSubmit)
        {   
            // Sign in header
            $(".entireSignInFields").prepend('<div class="py-5 text-center"><h2><u>'+clubList[i].clubName+' Sign In</u></h2></div>');

            if(clubList[i].shortHandName == "robotics"){
                $(".entireSignInFields").prepend('<center><img src="https://static1.squarespace.com/static/559dcc31e4b07b65f9721560/57d5f3c8e4fcb5c486bc6676/57d5f3c8e4fcb5c486bc6678/1473639369819/Our%2BLogo.jpg?format=500w"class="centerLogo"></img></center>')
            }

            // Get fields to show from the club selected
            var fieldsToShow = clubList[i].chosenFields; 
            var paragraphInstructions = (clubList[i].paragraphInstruction != undefined) ? clubList[i].paragraphInstruction : "Paragraph"; 
            var booleanInstructions = (clubList[i].booleanInstruction != undefined) ? clubList[i].booleanInstruction : "Boolean"; 
            for(let j = fieldsToShow.length - 1; j >=0; j--)
            {
                switch(fieldsToShow[j])
                {
                    case fields.NAME:
                    $("#signInForm").prepend('<div class="mb-3"><label for="name">Name</label><input type="text" class="form-control" id="name" placeholder="" required><div class="invalid-feedback">Please enter a valid name. </div></div>');
                    break; 

                    case fields.ASBNUMBER:
                    $("#signInForm").prepend('<div class="mb-3"><label for="asbnumber">ASB Number</label><input type="text" class="form-control" id="asbNumber" placeholder="" required><div class="invalid-feedback">Please enter a valid ASB number. </div></div>'); 
                    break; 

                    case fields.PARAGRAPH:
                    $("#signInForm").prepend('<div class="mb-3"><label for="paragraph">Paragraph Input</label><textarea type="text" class="form-control" id="paragraph" placeholder="'+paragraphInstructions+'"></textarea><div class="invalid-feedback">Please enter a valid paragraph.</div></div>'); 
                    break; 

                    case fields.EMAIL:
                    $("#signInForm").prepend('<div class="mb-3"><label for="email">Email</label><input type="text" class="form-control" id="email" placeholder="" required><div class="invalid-feedback">Please enter a valid email. </div></div>');
                    break; 

                    case fields.BOOLEAN: 
                    $("#signInForm").prepend('<div class="mb-3"><label for="sel1">'+booleanInstructions+'</label><select class="form-control" id="boolean"><option value="false">False</option><option value="true">True</option></select></div> ');
                    break; 

                    case fields.GRADE:
                    $("#signInForm").prepend('<div class="mb-3"><label for="grade">Grade</label><nav class="grade-buttons form-control" id="grade-buttons"><button type="button" class="btn btn-outline-primary disabled" id="g9" href="#">Grade 9</button><button type="button" class="btn btn-outline-primary disabled" id="g10" href="#">Grade 10</button><button type="button" class="btn btn-outline-primary disabled" id="g11" href="#">Grade 11</button><button type="button" class="btn btn-outline-primary disabled" id="g12" href="#">Grade 12</button></nav><div class="invalid-feedback">Please select your grade. </div></div>');
                    break; 

                    case fields.DATE: 
                    $("#signInForm").prepend('<div class="mb-3"><label for="address">Scheduler <span class="text-muted">(Optional)</span></label><input type="date" class="form-control" id="date" required><div class="invalid-feedback">Please enter a valid date. </div></div>');
                    break; 
                }
            }
			
			cookieFill();
			// This is for efficiency. Don't check rest of clubs if this club is the one searched for.
			break;
		}
    }

}

function cookieFill(){
	var savedName = getCookie(fields.NAME);
	var savedASB = getCookie(fields.ASBNUMBER);
	var savedEmail = getCookie(fields.EMAIL);
	var savedGrade = getCookie(fields.GRADE);
	
	if(savedName.length > 0 || savedASB.length > 0 || savedEmail.length > 0 || savedGrade.length > 0){
		$("#remember").prop('checked', true);
	}
	
	$('#name').val(savedName);
	$('#asbNumber').val(savedASB);
	$('#email').val(savedEmail);
	gradeToSubmit = savedGrade;

	$("#g" + gradeToSubmit).removeClass("disabled"); 
	$("#g" + gradeToSubmit).removeClass("btn-outline-primary"); 
	$("#g" + gradeToSubmit).addClass("btn-primary"); 
}

// On Sign In
$("#signinbutton").click(function(e){
	e.preventDefault(); 
    e.stopPropagation();
    updateBlockchain();
    var shouldSubmit = true; 

    // if(Math.abs(latitude - 47.522533) > .06 ||  
    //    Math.abs(longitude - -122.028751) > .06)
    // {
    //     $("#geolocationerror").show(); 
    //     shouldSubmit = false; 
    // }

    // If an element with id "name" exists
    if($('#name').length)
    {
        nameToSubmit = $('#name').val(); 
        if(nameToSubmit.length < 4 || /\d/.test(nameToSubmit))
        {
            $("#name").addClass("is-invalid");
            shouldSubmit = false; 
        }
        else
        {
            $("#name").addClass("is-valid");
        }
    }

    // If an element with id "email" exists
    if($('#email').length)
    {
        emailToSubmit = $('#email').val(); 
        if(emailToSubmit.length < 8 || !(emailToSubmit.includes("@")) || !(emailToSubmit.includes(".com")))
        {
            $("#email").addClass("is-invalid");
            shouldSubmit = false; 
        }
        else
        {
            $("#email").addClass("is-valid");
        }
    }

    // If an element with id "asbNumber" exists
    if($('#asbNumber').length)
    {
        asbNumberToSubmit = $('#asbNumber').val(); 
        if(asbNumberToSubmit.length < 4 || !asbNumberToSubmit.match(/^[0-9]+$/))
        {
            $("#asbNumber").addClass("is-invalid");
            shouldSubmit = false; 
        }
        else
        {
            $("#asbNumber").addClass("is-valid");
        }
    }

    // If an element with id "paragraph" exists
    if($('#paragraph').length)
    {
        paragraphToSubmit = $('#paragraph').val(); 
        if(paragraphToSubmit.length < 4)
        {
            $("#paragraph").addClass("is-invalid");
            shouldSubmit = false; 
        }
        else
        {
            $("#paragraph").addClass("is-valid");
        }
    }

    // If an element with id "date" exists
    // NOTE: date is currently optional
    if($('#date').length)
    {
        dateToSubmit = $('#date').val(); 
        $("#date").addClass("is-valid");
    }
    
    // If an element with id "grade-buttons" exists
    if($('#grade-buttons').length){
        if($('#g9').hasClass("btn-primary"))
        {
            gradeToSubmit = 9;
        } 
        else if($('#g10').hasClass("btn-primary"))
        {
            gradeToSubmit = 10;
        } 
        else if($('#g11').hasClass("btn-primary"))
        {
            gradeToSubmit = 11;
        } 
        else if($('#g12').hasClass("btn-primary"))
        {
            gradeToSubmit = 12;
        } 

        if(gradeToSubmit == 9 || gradeToSubmit == 10 || gradeToSubmit == 11 || gradeToSubmit == 12)
        {
            $("#grade-buttons").addClass("is-valid");
        }
        else
        {
            $("#grade-buttons").addClass("is-invalid")
            shouldSubmit = false; 
        }
    }

    // If an element with id "boolean" exists
    if($('#boolean').length)
    {
        // Always has value as selection element
        $("#boolean").addClass("is-valid");
        booleanToSubmit = $("#boolean").val(); 
    }

    // Get current timestamp
    timestampToSubmit = new Timestamp(); 
    timestampToSubmit.setCurrentTime(); 


    // Check to see if person already signed in that day
    for(let i=0; i<blockchainarray.length; i++)
    {
        if(nameToSubmit == blockchainarray[i].name &&
            clubToSubmit == blockchainarray[i].club && 
            timestampToSubmit.getSimpleDate() == blockchainarray[i].timestamp.getSimpleDate() &&
            gradeToSubmit == blockchainarray[i].grade)
            {
                $("#duplicateerror").show(); 
                shouldSubmit = false; 
            }
    }

    if(!shouldSubmit)
    {
        
    }
    else // Should submit
    {
		// If remember me is checked
		if($("#remember").is(':checked')){
			setCookie(fields.NAME, nameToSubmit, 30);
			setCookie(fields.ASBNUMBER, asbNumberToSubmit, 30);
			setCookie(fields.EMAIL, emailToSubmit, 30);
			setCookie(fields.GRADE, gradeToSubmit, 30);
			console.log("Remembered " + document.cookie);
		} else {
			deleteCookie(fields.NAME);
			deleteCookie(fields.ASBNUMBER);
			deleteCookie(fields.EMAIL);
			deleteCookie(fields.GRADE);
			console.log("Deleting cookies");
		}
		
        timestampToSubmit = new Timestamp(); 
        timestampToSubmit.setCurrentTime(); 

        previousHashToSubmit = blockchainarray[blockchainarray.length - 1].hash; 

        var blockToSubmit = new Block(nameToSubmit,asbNumberToSubmit,clubToSubmit,gradeToSubmit,timestampToSubmit,previousHashToSubmit,hashToSubmit, paragraphToSubmit, booleanToSubmit, emailToSubmit, dateToSubmit); 
        blockToSubmit.hash = blockToSubmit.calculateHash(); 

        addBlockToDatabase(blockToSubmit);

        $("#signInForm")[0].reset(); 

        $("#signInForm>div>input.is-valid").removeClass("is-valid");
        $("#signInForm>div>select.is-valid").removeClass("is-valid");
        $("#signInForm>div>textarea.is-valid").removeClass("is-valid");
        $("#signInForm>div>nav.is-valid").removeClass("is-valid");
        $("#signInForm>div>date.is-valid").removeClass("is-valid");

        $("#signInForm>div>input.is-invalid").removeClass("is-invalid");
        $("#signInForm>div>select.is-invalid").removeClass("is-invalid");
        $("#signInForm>div>textarea.is-invalid").removeClass("is-invalid");
        $("#signInForm>div>nav.is-invalid").removeClass("is-invalid");
        $("#signInForm>div>date.is-invalid").removeClass("is-invalid");

        $("#g9").removeClass("btn-primary"); 
        $("#g10").removeClass("btn-primary"); 
        $("#g11").removeClass("btn-primary"); 
        $("#g12").removeClass("btn-primary"); 

        $("#g9").addClass("btn-outline-primary"); 
        $("#g10").addClass("btn-outline-primary"); 
        $("#g11").addClass("btn-outline-primary"); 
        $("#g12").addClass("btn-outline-primary"); 

        $("#g9").addClass("disabled"); 
        $("#g10").addClass("disabled"); 
        $("#g11").addClass("disabled"); 
        $("#g12").addClass("disabled"); 

        $("#signInForm").prepend('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Sign In Success!</strong> Have a good one, '+nameToSubmit+' </div>');
    
        nameToSubmit=""; 
        emailToSubmit=""; 
        asbNumberToSubmit=""; 
        gradeToSubmit=""; 
        paragraphToSubmit="";
        dateToSubmit=""; 
        booleanToSubmit=""; 
        timestampToSubmit="";
        previousHashToSubmit=""; 
        hashToSubmit="";
    }

}); 


// Grade button click handling

    $('.entireSignInFields').on('click', '#g9', function(e)
    {
        e.preventDefault(); 

        if($("#g9").hasClass("disabled"))
        {
            $("#g9").removeClass("disabled"); 
            $("#g10").addClass("disabled"); 
            $("#g11").addClass("disabled"); 
            $("#g12").addClass("disabled"); 

            $("#g10").removeClass("btn-primary"); 
            $("#g10").addClass("btn-outline-primary"); 
            $("#g11").removeClass("btn-primary"); 
            $("#g11").addClass("btn-outline-primary"); 
            $("#g12").removeClass("btn-primary"); 
            $("#g12").addClass("btn-outline-primary"); 

            $("#g9").removeClass("btn-outline-primary"); 
            $("#g9").addClass("btn-primary"); 
            gradeToSubmit = 9; 
        } 
        else
        {
            $("#g9").addClass("disabled"); 
            $("#g9").removeClass("btn-primary"); 
            $("#g9").addClass("btn-outline-primary"); 
            gradeToSubmit = undefined; 
        }
    }); 

    $('.entireSignInFields').on('click', '#g10', function(e)
    {
        e.preventDefault(); 

        if($("#g10").hasClass("disabled"))
        {
            $("#g9").addClass("disabled"); 
            $("#g10").removeClass("disabled"); 
            $("#g11").addClass("disabled"); 
            $("#g12").addClass("disabled"); 

            $("#g9").removeClass("btn-primary"); 
            $("#g9").addClass("btn-outline-primary"); 
            $("#g11").removeClass("btn-primary"); 
            $("#g11").addClass("btn-outline-primary"); 
            $("#g12").removeClass("btn-primary"); 
            $("#g12").addClass("btn-outline-primary"); 

            $("#g10").removeClass("btn-outline-primary"); 
            $("#g10").addClass("btn-primary"); 
            gradeToSubmit = 10; 
        } 
        else
        {
            $("#g10").removeClass("btn-primary"); 
            $("#g10").addClass("btn-outline-primary"); 
            $("#g10").addClass("disabled"); 
            gradeToSubmit = undefined; 
        }
    }); 

    $('.entireSignInFields').on('click', '#g11', function(e)
    {
        e.preventDefault(); 

        if($("#g11").hasClass("disabled"))
        {
            $("#g9").addClass("disabled"); 
            $("#g10").addClass("disabled"); 
            $("#g11").removeClass("disabled"); 
            $("#g12").addClass("disabled"); 

            $("#g10").removeClass("btn-primary"); 
            $("#g10").addClass("btn-outline-primary"); 
            $("#g9").removeClass("btn-primary"); 
            $("#g9").addClass("btn-outline-primary"); 
            $("#g12").removeClass("btn-primary"); 
            $("#g12").addClass("btn-outline-primary"); 

            $("#g11").removeClass("btn-outline-primary"); 
            $("#g11").addClass("btn-primary"); 
            gradeToSubmit = 11; 
        } 
        else
        {
            $("#g11").removeClass("btn-primary"); 
            $("#g11").addClass("btn-outline-primary"); 
            $("#g11").addClass("disabled"); 
            gradeToSubmit = undefined; 
        }
    }); 

    $('.entireSignInFields').on('click', '#g12', function(e)
    {
        e.preventDefault(); 

        if($("#g12").hasClass("disabled"))
        {
            $("#g9").addClass("disabled"); 
            $("#g10").addClass("disabled"); 
            $("#g11").addClass("disabled"); 
            $("#g12").removeClass("disabled"); 

            $("#g9").removeClass("btn-primary"); 
            $("#g9").addClass("btn-outline-primary"); 
            $("#g10").removeClass("btn-primary"); 
            $("#g10").addClass("btn-outline-primary"); 
            $("#g11").removeClass("btn-primary"); 
            $("#g11").addClass("btn-outline-primary"); 

            $("#g12").removeClass("btn-outline-primary"); 
            $("#g12").addClass("btn-primary"); 
            gradeToSubmit = 12; 
        } 
        else
        {
            $("#g12").removeClass("btn-primary"); 
            $("#g12").addClass("btn-outline-primary"); 
            $("#g12").addClass("disabled"); 
            gradeToSubmit = undefined; 
        }
    }); 
	
// Store cookies
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname){
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
