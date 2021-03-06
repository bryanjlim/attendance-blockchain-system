var clubToExport; 
var properClubName;

var exportFieldDefault = $(".entireExportFields").clone().html();

// Bind hashchange to onHashChange function
$(window).on('hashchange', onHashChange);

// Check hash on startup
onHashChange();

// Override hashchange function (When this code makes a hashchange)
var override = false;

function onHashChange(){
	// Load correct page
	updateAttendanceData(function(){
		if(!override){
			if(window.location.hash == ""){
				if($('#entireClubSelection:visible').length < 1){ // On club sign in page, but no hash
					window.location.reload(); // Reload page to get back to entire club selection
				}
			} else {				
				$("#entireClubSelection").hide();	
				$(".entireExportFields").empty();
				$(".entireExportFields").html(exportFieldDefault);
				clubToExport = window.location.hash.replace("#", "");
				
				loadExport();
				
				$(".entireExportFields").show();
			}
		} else {
			// Reset override (use once)
			override = false;
		}
	});
}

// On club selection from list
$('#entireClubSelection').on('click', '.clubLink', function(e)
{
	selectClub($(this).attr('shorthand'));
});

$('#selectClubForm').submit(function(e){
	e.preventDefault();
	club = search();
	selectClub(club);
	return false;
});
var selected = false;
function selectClub(club){
	if(!selected){
		selected = true;
		clubToExport = club;
		updateAttendanceData(function(){
			loadExport();
			// Animate selection
			$("#entireClubSelection").hide(250); 
			$(".entireExportFields").show(250); 
		});
		
		override = true;

	}
}

function loadExport(){	
    makeLeaderboard();		
    for(let i=0; i<clubList.length; i++){
        if(clubList[i].shortHandName == clubToExport)
        {  
            // Export header
            properClubName = clubList[i].clubName;
            $(".entireExportFields").prepend('<div class="py-5 text-center"><h2><u>'+properClubName+' Export By Date</u></h2></div>');
        }
    }
    // Populate year   
    for(let i=0; i < attendancedata.length; i++)
    {
        var currentEntry = attendancedata[i]; 
        var year = currentEntry.timestamp.year; 

        if($("#year option[value="+year+"]").length == 0 && currentEntry.club == clubToExport)
        {
            $('#year').append('<option value="'+year+'">'+year+'</option>');
        }
    }
	// Set hash to club shorthand
    window.location.hash = clubToExport;

}


// On Year Change
$(document.body).on('change', "#year", function (e) {
    var optionSelected = $("option:selected", this);
    var yearSelected = this.value;

    // Populate months
    for(let i=0; i < attendancedata.length; i++)
    {
        var currentEntry = attendancedata[i]; 
        var month = currentEntry.timestamp.month; 

        if($("#month option[value="+month+"]").length == 0 && currentEntry.club == clubToExport && currentEntry.timestamp.year == yearSelected)
        {
            $('#month').append('<option value="'+month+'">'+month+'</option>');
        }
    }
    
    // Ensure dates are empty
    $('#date')
    .find('option')
    .remove()
    .end()
    .append('<option value="none"></option>')
    .val('none')
    ;
});

// On Month Change
$(document.body).on('change', "#month", function (e) {
    var optionSelected = $("option:selected", this);
    var monthSelected = this.value;

    // Populate months
    for(let i=0; i < attendancedata.length; i++)
    {
        var currentEntry = attendancedata[i]; 
        var day = currentEntry.timestamp.day; 

        if($("#day option[value="+day+"]").length == 0 && currentEntry.club == clubToExport && currentEntry.timestamp.month == monthSelected)
        {
            $('#day').append('<option value="'+day+'">'+day+'</option>');
        }
    }
});

// On export 
$(document.body).on('click', "#export", function (e) {
    var shouldExport = true;

    if($('#year').val() == "none" || $('#year').val() == "")
    {
        $("#year").addClass("is-invalid");
        shouldExport = false; 
    }

    if($('#month').val() == "none" || $('#month').val() == "")
    {
        $("#month").addClass("is-invalid");
        shouldExport = false; 
    }

    if($('#day').val() == "none" || $('#day').val() == "")
    {
        $("#day").addClass("is-invalid");
        shouldExport = false; 
    }

    if(!shouldExport)
    {
        e.preventDefault(); 
        e.stopPropagation();
    }
    else
    {
        e.preventDefault(); 
		e.stopPropagation();
        $(".alert").show(); 

        var exportMonth = $("#month").val(); 
        var exportDay = $("#day").val(); 
        var exportYear = $("#year").val(); 
		
        var exportDate = exportMonth+"/"+exportDay+"/"+exportYear;
		var date = new Date(exportYear, exportMonth - 1, exportDay, 0, 0, 0, 0);
		var formattedDate = date.getFormattedDate();
		var firstRow = [formattedDate];
        var secondRow = []; 
        for(let i = 0; i < clubList.length; i++)
        {
            if(clubList[i].shortHandName == clubToExport)
            {
                for(let j = 0; j < clubList[i].chosenFields.length; j++)
                {
                    secondRow.push(clubList[i].chosenFields[j]);
                }
            }
        }

        var rows = [firstRow, secondRow];
        var rowNum = 2;
        for(let i = 0; i < attendancedata.length; i++){
            var signinentry = attendancedata[i];

            if(signinentry.timestamp.getSimpleDate() == exportDate && signinentry.club == clubToExport){
                var rowToAdd = []; 
                for(let j = 0; j < secondRow.length; j++)
                {
                    switch(secondRow[j])
                    {
                        case fields.NAME: 
                        rowToAdd.push(signinentry.name); 
                        break;

                        case fields.ASBNUMBER:
                        rowToAdd.push(signinentry.asbNumber); 
                        break; 

                        case fields.PARAGRAPH:
                        rowToAdd.push(signinentry.paragraph); 
                        break; 

                        case fields.EMAIL:
                        rowToAdd.push(signinentry.email); 
                        break; 

                        case fields.BOOLEAN:
                        rowToAdd.push(signinentry.boolean); 
                        break; 

                        case fields.GRADE:
                        rowToAdd.push(signinentry.grade); 
                        break;  

                        case fields.DATE:
                        rowToAdd.push(signinentry.date); 
                        break;  
                    }
                }
                rows[rowNum] = rowToAdd;
                rowNum++;
            }
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function(rowArray){
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        }); 
        
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        var csvFileName = (""+properClubName + " " + exportDate + " Attendance.csv"); 
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", csvFileName);
        document.body.appendChild(link);

        link.click();

        $("#exportForm")[0].reset(); 
    }
}); 

// On export all
$(document.body).on('click', "#exportAll", function (e) {    
    e.preventDefault(); 
    $(".alert").show(); 

    var firstRow = ["Date"]; 
	var clubName;
    for(let i = 0; i < clubList.length; i++)
    {
        if(clubList[i].shortHandName == clubToExport)
        {
			clubName = clubList[i].clubName;
            for(let j = 0; j < clubList[i].chosenFields.length; j++)
            {
                firstRow.push(clubList[i].chosenFields[j]);
            }
			break;
        }
    }
	var header = [clubName + " Full Attendance List"];
    var rows = [header, firstRow];
    var rowNum = 2;
      
    for(let i = 0; i < attendancedata.length; i++)
    {
        var signinentry = attendancedata[i];
        if(signinentry.club == clubToExport)
        {
            var rowToAdd = [signinentry.timestamp.getSimpleDate()]; 
            for(let j = 0; j < firstRow.length; j++)
            {
                switch(firstRow[j])
                {
                    case fields.NAME: 
                    rowToAdd.push(signinentry.name);
                    break;
                    
                    case fields.ASBNUMBER:
                    rowToAdd.push(signinentry.asbNumber); 
                    break; 

                    case fields.PARAGRAPH:
                    rowToAdd.push(signinentry.paragraph); 
                    break; 

                    case fields.EMAIL:
                    rowToAdd.push(signinentry.email); 
                    break; 

                    case fields.BOOLEAN:
                    rowToAdd.push(signinentry.boolean); 
                    break; 

                    case fields.GRADE:
                    rowToAdd.push(signinentry.grade); 
                    break;  

                    case fields.DATE:
                    rowToAdd.push(signinentry.date); 
                    break;  
                }
            }

            rows[rowNum] = rowToAdd;
            rowNum++;
        }
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function(rowArray)
    {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    }); 

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    var csvFileName = (""+properClubName +" Entire Attendance.csv"); 
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", csvFileName);
    document.body.appendChild(link);

    link.click();

    $("#exportForm")[0].reset(); 
}); 

function makeLeaderboard(){
    var leaderboard = {};
    var firstRow = ["Date"]; 
    for(let i = 0; i < attendancedata.length; i++)
    {
        var signinentry = attendancedata[i];
        if(signinentry.club == clubToExport)
        {
            for(let j = 0; j < firstRow.length; j++)
            {
                switch(firstRow[j])
                {
                    case fields.NAME: 
                    rowToAdd.push(signinentry.name);
                    if(fields.NAME in leaderboard){
                        leaderboard[fields.NAME] = 1;
                    } else{
                        leaderboard[fields.NAME] = leaderboard[fields.NAME]+1;
                    }
                    break;
                }
            }
        }
    }
    // Create items array
    var items = Object.keys(leaderboard).map(function(key) {
        return [key, dict[key]];});
    // Sort the array based on the second element
    items.sort(function(first, second) {
        return second[1] - first[1];});
     // Create a new array with only the first 5 items
    var top5 = console.log(items.slice(0, 5));
    //document.getElementById('output').innerHTML = leaderboard.keys;
    //displayTop5(top5);
}

function displayTop5(top5){
    for(var i = 1; i <= 5; i++){
        document.getElementById('name'+i).innerHTML = top5[i];
    }
}

function explodePie(e) {
	for(var i = 0; i < e.dataSeries.dataPoints.length; i++) {
		if(i !== e.dataPointIndex)
			e.dataSeries.dataPoints[i].exploded = false;
	}
}