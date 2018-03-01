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
	if(!override){
		if(window.location.hash == ""){
			if($('#entireClubSelection:visible').length < 1){ // On club sign in page, but no hash
				window.location.reload(); // Reload page to get back to entire club selection
			}
		} else {	
		updateBlockchain();
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
}

// On club selection from list
$('#entireClubSelection').on('click', '.clubLink', function(e)
{
    updateBlockchain();
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
		updateBlockchain();
		
		override = true;
		loadExport();
		
		// Animate selection
		$("#entireClubSelection").hide(250); 
		$(".entireExportFields").show(250); 
	}
}

function loadExport(){
			
    for(let i=0; i<clubList.length; i++){
        if(clubList[i].shortHandName == clubToExport)
        {  
            // Export header
            properClubName = clubList[i].clubName;
            $(".entireExportFields").prepend('<div class="py-5 text-center"><h2><u>'+properClubName+' Export By Date</u></h2></div>');
        }
    }

    // Populate year   
    for(let i=0; i < blockchainarray.length; i++)
    {
        var currentBlock = blockchainarray[i]; 
        var year = currentBlock.timestamp.year; 

        if($("#year option[value="+year+"]").length == 0 && currentBlock.club == clubToExport)
        {
            $('#year').append('<option value="'+year+'">'+year+'</option>');
        }
    }
	// Set hash to club shorthand
	window.location.hash = clubToExport;

}


// On Year Change
$('#year').on('change', function (e) {
    var optionSelected = $("option:selected", this);
    var yearSelected = this.value;

    // Populate months
    for(let i=0; i < blockchainarray.length; i++)
    {
        var currentBlock = blockchainarray[i]; 
        var month = currentBlock.timestamp.month; 

        if($("#month option[value="+month+"]").length == 0 && currentBlock.club == clubToExport && currentBlock.timestamp.year == yearSelected)
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
$('#month').on('change', function (e) {
    var optionSelected = $("option:selected", this);
    var monthSelected = this.value;

    // Populate months
    for(let i=0; i < blockchainarray.length; i++)
    {
        var currentBlock = blockchainarray[i]; 
        var day = currentBlock.timestamp.day; 

        if($("#day option[value="+day+"]").length == 0 && currentBlock.club == clubToExport && currentBlock.timestamp.month == monthSelected)
        {
            $('#day').append('<option value="'+day+'">'+day+'</option>');
        }
    }
});

// On export 
$("#export").click(function(e){
    updateBlockchain();
	
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

        var firstRow = []; 
        for(let i = 0; i < clubList.length; i++)
        {
            if(clubList[i].shortHandName == clubToExport)
            {
                for(let j = 0; j < clubList[i].chosenFields.length; j++)
                {
                    firstRow.push(clubList[i].chosenFields[j]);
                }
            }
        }

        var rows = [firstRow];
        var rowNum = 1;
		console.log(blockchainarray.length);
		var bcCopy = cloner.shallow.copy(blockchainarray);
        for(let i = 0; i < blockchainarray.length; i++){
            var block = cloner.deep.copy(bcCopy[i]);

            if(block.timestamp.getSimpleDate() == exportDate && block.club == clubToExport){
                var rowToAdd = []; 
                for(let j = 0; j < firstRow.length; j++)
                {
                    switch(firstRow[j])
                    {
                        case fields.NAME: 
                        rowToAdd.push(block.name); 
                        break;

                        case fields.ASBNUMBER:
                        rowToAdd.push(block.asbNumber); 
                        break; 

                        case fields.PARAGRAPH:
                        rowToAdd.push(block.paragraph); 
                        break; 

                        case fields.EMAIL:
                        rowToAdd.push(block.email); 
                        break; 

                        case fields.BOOLEAN:
                        rowToAdd.push(block.boolean); 
                        break; 

                        case fields.GRADE:
                        rowToAdd.push(block.grade); 
                        break;  

                        case fields.DATE:
                        rowToAdd.push(block.date); 
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
$("#exportAll").click(function(e){
    updateBlockchain();

    
    e.preventDefault(); 
    $(".alert").show(); 

    var firstRow = []; 
    for(let i = 0; i < clubList.length; i++)
    {
        if(clubList[i].shortHandName == clubToExport)
        {
            for(let j = 0; j < clubList[i].chosenFields.length; j++)
            {
                firstRow.push(clubList[i].chosenFields[j]);
            }
        }
    }

    var rows = [firstRow];
    var rowNum = 1;
    for(var i = 0; i < blockchainarray.length; i++)
    {
        var block = blockchainarray[i];
        if(block.club == clubToExport)
        {
            var rowToAdd = []; 
            for(let i = 0; i < firstRow.length; i++)
            {
                switch(firstRow[i])
                {
                    case fields.NAME: 
                    rowToAdd.push(block.name); 
                    break;

                    case fields.ASBNUMBER:
                    rowToAdd.push(block.asbNumber); 
                    break; 

                    case fields.PARAGRAPH:
                    rowToAdd.push(block.paragraph); 
                    break; 

                    case fields.EMAIL:
                    rowToAdd.push(block.email); 
                    break; 

                    case fields.BOOLEAN:
                    rowToAdd.push(block.boolean); 
                    break; 

                    case fields.GRADE:
                    rowToAdd.push(block.grade); 
                    break;  

                    case fields.DATE:
                    rowToAdd.push(block.date); 
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

$("#gender").click(function(e){
    e.preventDefault(); 

    for(let i=0; i<clubList.length; i++)
    {
        if(clubList[i].shortHandName == clubToExport)
        {  
            properClubName = clubList[i].clubName;
        }
    }

    var names = []; 
    var males = 0; 
    var females = 0; 
	
    for(let i = 0; i < blockchainarray.length; i++)
    {
        var block = blockchainarray[i];
        if(block.club == clubToExport)
        {
            if(!(names.includes(block.name)))
            {
                names.push(block.name);
            }
        }
    }

    for(let i = 0; i < names.length; i++)
    {
        var stringsInName = names[i].split(" "); 

        if(getGenderFromName(stringsInName[0]) == "male")
        {
            males++; 
        } 
        else if(getGenderFromName(stringsInName[0]) == "female")
        {
            females++; 
        }
    }

    var totalCount = males + females; 

    if(totalCount == 0)
    {
        alert("API Error. Try again tomorrow.");
    }
    else
    {
        var chart = new CanvasJS.Chart("genderChart", {
            theme: "light2",
            animationEnabled: true,
            title: {
                text: "Gender Distribution"
            },
            subtitles: [{
                text: properClubName,
                fontSize: 16
            }],
            data: [{
                type: "pie",
                indexLabelFontSize: 18,
                radius: 80,
                indexLabel: "{label} - {y}",
                yValueFormatString: "###0.0\"%\"",
                click: explodePie,
                dataPoints: [
                    { y: (males/totalCount*100), label: "Males" },
                    { y: (females/totalCount*100), label: "Females"},
                ]
            }]
        });
        chart.render();
    
        $("#genderChart").show();
    }
});



function explodePie(e) {
	for(var i = 0; i < e.dataSeries.dataPoints.length; i++) {
		if(i !== e.dataPointIndex)
			e.dataSeries.dataPoints[i].exploded = false;
	}
}