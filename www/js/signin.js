// Variables for submission
var nameToSubmit=""; 
var emailToSubmit=""; 
var asbNumberToSubmit=""; 
var clubToSubmit=""; 
var gradeToSubmit=""; 
var paragraphToSubmit="";
var booleanToSubmit=""; 
var timestampToSubmit="";
var previousHashToSubmit=""; 
var hashToSubmit="";
 
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
			generateClubFields(window.location.hash.replace("#", ""));		
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
	// Get shorthand name of selected club
	clubToSubmit = $(e.target).attr('shorthand');
	selectClub(clubToSubmit);
});

$('#selectClubForm').submit(function(e){
	e.preventDefault();
	selectClub(search());
	return false;
});

// Only allow one club to be selected from the list
var selected = false;

// Select club and animate selection
function selectClub(clubToSubmit){
	if(!selected) {			
		// Make sure club is only selected once.
		selected = true;
		
		// Code is making hashchange. Override hashchange function.
		override = true;
		
		// Set hash to club shorthand
		window.location.hash = clubToSubmit;
		
		// Generate selection fields for selected club
		generateClubFields(clubToSubmit);
		
		// Animate selection
		$("#entireClubSelection").hide(250); 
		$(".entireSignInFields").show(250); 
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
                    $("#signInForm").prepend('<div class="mb-3"><label for="email">Email</label><input type="text" class="form-control" id="email" placeholder="" required><div class="invalid-feedback">Please enter a valid email. </div></div>')
                    break; 

                    case fields.BOOLEAN: 
                    $("#signInForm").prepend('<div class="mb-3"><label for="sel1">'+booleanInstructions+'</label><select class="form-control" id="boolean"><option>False</option><option>True</option></select></div> ')
                    break; 

                    case fields.GRADE:
                    $("#signInForm").prepend('<div class="mb-3"><label for="grade">Grade</label><nav class="grade-buttons form-control" id="grade-buttons"><button type="button" class="btn btn-outline-primary disabled" id="g9" href="#">Grade 9</button><button type="button" class="btn btn-outline-primary disabled" id="g10" href="#">Grade 10</button><button type="button" class="btn btn-outline-primary disabled" id="g11" href="#">Grade 11</button><button type="button" class="btn btn-outline-primary disabled" id="g12" href="#">Grade 12</button></nav><div class="invalid-feedback">Please select your grade. </div></div>')
                    break; 
                }
            }
			// This is for efficiency. Don't check rest of clubs if this club is the one searched for.
			break;
		}
    }

}

// On Sign In
$("#signinbutton").click(function(e){
    updateBlockchain();
    var shouldSubmit = true; 

    if(Math.abs(latitude - 47.522533) > .06 ||  
       Math.abs(longitude - -122.028751) > .06)
    {
        $("#geolocationerror").show(); 
        shouldSubmit = false; 
    }

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
    
    // If an element with id "grade-buttons" exists
    if($('#grade-buttons').length){
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
    }

    if(!shouldSubmit)
    {
        e.preventDefault(); 
        e.stopPropagation();
    }
    else // Should submit
    {
        timestampToSubmit = new Timestamp(); 
        timestampToSubmit.setCurrentTime(); 

        previousHashToSubmit = blockchainarray[blockchainarray.length - 1].hash; 

        var blockToSubmit = new Block(nameToSubmit,asbNumberToSubmit,clubToSubmit,gradeToSubmit,timestampToSubmit,previousHashToSubmit,hashToSubmit, paragraphToSubmit, booleanToSubmit, emailToSubmit); 
        blockToSubmit.hash = blockToSubmit.calculateHash(); 

        addBlockToDatabase(blockToSubmit);
        $("#signInForm")[0].reset(); 
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
            grade = 9; 
        } 
        else
        {
            $("#g9").addClass("disabled"); 
            $("#g9").removeClass("btn-primary"); 
            $("#g9").addClass("btn-outline-primary"); 
            grade = undefined; 
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

            $("#g12").removeClass("btn-primary"); 
            $("#g12").addClass("btn-outline-primary"); 
            $("#g11").removeClass("btn-primary"); 
            $("#g11").addClass("btn-outline-primary"); 
            $("#g12").removeClass("btn-primary"); 
            $("#g12").addClass("btn-outline-primary"); 

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