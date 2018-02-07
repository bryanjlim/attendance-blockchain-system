import React, { Component } from 'react';
import './styling/App.css';
import Block from './javascripts/Block';
import Blockchain from './javascripts/Blockchain';
import Timestamp from './javascripts/Timestamp';
import FirebaseHelper from './javascripts/FirebaseHelper';
import GeolocationHelper from './javascripts/GeolocationHelper';

export default class App extends Component {

    constructor() 
    {
        super();
        this.state = {name: '', 
                      club:'none', 
                      asbNumber: '',
                      grade:'select', 
                      attendanceRecord: new Blockchain(), 
                      exportValue: "", 
                      exportClub: 'select', 
                      exportDates: [<option key={1} value="select">Select A Date</option>], 
                      exportDate:''
                    };

        this.firebaseHelper = new FirebaseHelper(); 

        this.handleClubChange = this.handleClubChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleASBNumberChange = this.handleASBNumberChange.bind(this);
        this.handleGradeChange = this.handleGradeChange.bind(this);
        this.signIn = this.signIn.bind(this);
        
        this.handleExportClubChange = this.handleExportClubChange.bind(this);
        this.repopulateExportDates = this.repopulateExportDates.bind(this);
        this.handleExportDateChange = this.handleExportDateChange.bind(this);
        this.export = this.export.bind(this);

        this.geolocationHelper = new GeolocationHelper(); 
    }

    // Mounting for consistent refreshing
    componentWillMount() 
    {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 100);
        this.firebaseHelper.updateBlockchain(this.state.attendanceRecord);
    }

    componentWillUnmount() 
    {
        clearInterval(this.interval);
    }

    // Sign in verification and block adding process
    signIn(e) 
    {
        e.preventDefault(); 

        alert(Math.abs(this.geolocationHelper.latitude - 47.522533));
        alert(Math.abs(this.geolocationHelper.longitude - -122.028751));

        if(this.state.club == "select")
        {
            alert("Please select a club");
        }
        else if(Math.abs(this.geolocationHelper.latitude - 47.522533) > .007 ||  
                Math.abs(this.geolocationHelper.longitude - -122.028751) > .007)
        {
            alert("Your location is not detected to be at Issaquah High School. Try connecting to the Wi-Fi or relocating.")
        }
        else if(this.state.name.length < 4 || /\d/.test(this.state.name))
        {
            alert("Please enter a valid full name");
        }
        else if(this.isDuplicateEntry())
        {
            alert("You have already signed in today");
        }
        else
        {
            if(this.state.asbNumber.length < 2)
            {
                this.state.asbNumber = 0; 
            }
            var addBlock = new Block(this.state.name, this.state.asbNumber, this.state.club, this.state.grade); 
            this.firebaseHelper.addBlockToDatabase(addBlock, this.state.attendanceRecord);
            this.repopulateExportDates(this.state.exportClub);

            this.state.name = "";
            this.state.asbNumber = "";
            this.state.grade = "select";
        }
    }

    isDuplicateEntry()
    {
        var currentTime = new Timestamp();
        currentTime.setCurrentTime(); 

        for(var i =0; i < this.state.attendanceRecord.chain.length; i++){
            if(this.state.attendanceRecord.chain[i].asbNumber == this.state.asbNumber 
                && this.state.attendanceRecord.chain[i].timestamp == currentTime.toString()
                && this.state.attendanceRecord.chain[i].grade == this.state.grade)
            {
                return true; 
            }
        }
        return false; 
    }

    // Repopulate export dates based on the selected clubs
    repopulateExportDates(club)
    {  
        this.firebaseHelper.updateBlockchain(this.state.attendanceRecord);

        var dates =[]; 
        this.state.exportDates = [<option key={1} value="select">Select A Date</option>]; 

        for(var i = 0; i < this.state.attendanceRecord.chain.length; i++)
        {
            var block = this.state.attendanceRecord.chain[i];

            if(block.club == club)
            {
                if(dates.length == 0 || block.timestamp != dates[dates.length-1])
                {
                    dates.push(block.timestamp.toString()); 
                }
            }
        }

        for(var i = 0; i < dates.length; i++) 
        {
            this.state.exportDates.push(<option key={i+2} value={dates[i]}>{dates[i]}</option>); 
        }
    }

    // Export attendance data based on chosen export club and date
    export(e) 
    {
        e.preventDefault(); 
        
        this.firebaseHelper.updateBlockchain(this.state.attendanceRecord);

        if(this.state.exportClub == "select"){
            alert("Please select a club");
        }
        else if(this.state.exportDate == "select"){
            alert("Please select an export date");
        }
        else{
			var rows = [["Grade", "Name", "ASB #"]];
			var rowNum = 1;
			for(var i = 0; i < this.state.attendanceRecord.chain.length; i++){
				var block = this.state.attendanceRecord.chain[i];
				if(block.timestamp == this.state.exportDate && block.club == this.state.exportClub){
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
            var csvFileName = (this.state.exportClub.charAt(0).toUpperCase() + this.state.exportClub.slice(1)) + " Club " + this.state.exportDate + " Attendance.csv"; 
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", csvFileName);
			document.body.appendChild(link);

			link.click();
        }
    }

    render() {
        return (
            <div class="mainScreen">

                <form>

                    <h1 class="title">Attendance Blockchain System</h1>

                    <div class="centerWrapper">

                        <h2><u>Individual Sign In</u></h2>

                        <div class ="selectWrapper"> 
                            <select value={this.state.club} onChange={this.handleClubChange} class="select">
                                <option value="select">Select a Club</option>
                                <option value="robotics">Robotics Club</option>
                                <option value="code">Code Club</option>
                                <option value="test">Test Club</option>
                            </select>
                        </div>

                        <div class="name">
                            <label class ="nameText">Full Name: </label>
                            <input type="text" value={this.state.name} onChange={this.handleNameChange} class="nameForm"/>
                        </div>

                        <div class="name">
                            <label class ="nameText">ASB Number (Optional): </label>
                            <input type="text" value={this.state.asbNumber} onChange={this.handleASBNumberChange} class="nameForm"/>
                        </div>

                        <div class ="selectWrapper"> 
                            <select value={this.state.grade} onChange={this.handleGradeChange} class="select">
                                <option value="select">Select a Grade</option>
                                <option value="Grade 9">9</option>
                                <option value="Grade 10">10</option>
                                <option value="Grade 11">11</option>
                                <option value="Grade 12">12</option>
                            </select>
                        </div>

                        <div class="signInButtonWrapper">
                            <button class="signInButton" onClick={this.signIn}>
                                Sign In
                            </button>
                        </div>

                        <h2><u>Export Attendance Data</u></h2>

                        <div class ="selectWrapper"> 
                            <select value={this.state.exportClub} onChange={this.handleExportClubChange} class="select">
                                <option value="select">Select a Club</option>
                                <option value="robotics">Robotics Club</option>
                                <option value="code">Code Club</option>
                                <option value="test">Test Club</option>
                            </select>
                        </div>

                        <div class ="selectWrapper"> 
                            <select value={this.state.exportDate} onChange={this.handleExportDateChange} class="select">
                                {this.state.exportDates}
                            </select>
                        </div>

                        <div class="exportButtonWrapper">
                            <button class="exportButton" onClick={this.export}>
                                Export
                            </button>
                        </div>

                        <p>{this.state.exportValue}</p>
                        <b>Blockchain Validity: {this.state.attendanceRecord.verifyBlockchain() ? "True" : "False"}</b>
                    </div>

                </form> 

            </div> 
        );
    }

    // Handle form changes
    handleClubChange(event) 
    {
        this.setState({club: event.target.value});  
    }

    handleNameChange(event) 
    {
        this.setState({name: event.target.value});
    }

    handleASBNumberChange(event) 
    {
        this.setState({asbNumber: event.target.value});
    }

    handleGradeChange(event) 
    {
        this.setState({grade: event.target.value});
    }

    handleExportClubChange(event){
        this.setState({exportClub: event.target.value});  
        this.repopulateExportDates(event.target.value);
    }

    handleExportDateChange(event){
        this.setState({exportDate: event.target.value});
    }
}
