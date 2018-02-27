var clubToExport; 
var properClubName; 

// On club selection from list
$('#entireClubSelection').on('click', '.clubLink', function(e)
{
    updateBlockchain();
    clubToExport = $(e.target).attr('shorthand');

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

    $("#entireClubSelection").hide(250); 
    $(".entireExportFields").show(250); 
});


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
        $(".alert").show(); 

        var exportMonth = $("#month").val(); 
        var exportDay = $("#day").val(); 
        var exportYear = $("#year").val(); 

        var exportDate = exportMonth+"/"+exportDay+"/"+exportYear;

        var rows = [["Grade", "Name", "ASB #"]];
        var rowNum = 1;
        for(var i = 0; i < blockchainarray.length; i++){
            var block = blockchainarray[i];
            if(block.timestamp.getSimpleDate() == exportDate && block.club == clubToExport){
                rows[rowNum] = [block.grade, block.name, block.asbNumber];
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

    var rows = [["Grade", "Name", "ASB #"]];
    var rowNum = 1;
    for(var i = 0; i < blockchainarray.length; i++){
        var block = blockchainarray[i];
        if(block.club == clubToExport){
            rows[rowNum] = [block.grade, block.name, block.asbNumber];
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
    var csvFileName = (""+properClubName +" Entire Attendance.csv"); 
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", csvFileName);
    document.body.appendChild(link);

    link.click();

    $("#exportForm")[0].reset(); 
}); 

$("#gender").click(function(e){
    e.preventDefault(); 

    for(let i=0; i<clubList.length; i++){
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