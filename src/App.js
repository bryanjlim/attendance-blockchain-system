import React, { Component } from 'react';
import './App.css';
import Block from './Block';
import Blockchain from './Blockchain';

export default class App extends Component {

    constructor() 
    {
        super();
        this.state = {name: '', 
                      club:'none', 
                      grade:'select', 
                      attendanceRecord: new Blockchain(), 
                      exportValue: "", 
                      exportClub: 'select', 
                      exportDates: [<option key={1} value="select">Select A Date</option>], 
                      exportDate:''
                    };

        this.handleClubChange = this.handleClubChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleGradeChange = this.handleGradeChange.bind(this);
        this.signIn = this.signIn.bind(this);
        
        this.handleExportClubChange = this.handleExportClubChange.bind(this);
        this.repopulateExportDates = this.repopulateExportDates.bind(this);
        this.handleExportDateChange = this.handleExportDateChange.bind(this);
        this.export = this.export.bind(this);
    }

    // Mounting for consistent refreshing
    componentDidMount() 
    {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 100);
    }

    componentWillUnmount() 
    {
        clearInterval(this.interval);
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

    // Sign in verification and block adding process
    signIn(e) 
    {
        e.preventDefault(); 

        if(this.state.club == "select"){
            alert("Please select a club");
        }
        else if(this.state.name == ""){
            alert("Please enter a name");
        }
        else{
            this.state.attendanceRecord.addBlock(new Block(this.state.name, this.state.club, this.state.grade)); 
            this.repopulateExportDates(this.state.exportClub);

            this.state.name = "";
            this.state.grade = "select";
        }
    }

    // Repopulate export dates based on the selected clubs
    repopulateExportDates(club)
    {  
        for(var i = 0; i < this.state.attendanceRecord.chain.length; i++)
        {
            this.state.exportDates = [<option key={1} value="select">Select A Date</option>]; 
            var dates =[]; 
            var block = this.state.attendanceRecord.chain[i];

            if(block.club == club)
            {
                if(i == 0)
                {
                    dates[0] = block.timestamp.toString(); 
                }
                else if(block.timestamp != dates[i-1]){
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

        if(this.state.exportClub == "select"){
            alert("Please select a club");
        }
        else if(this.state.exportDate == "select"){
            alert("Please enter a name");
        }
        else{
            this.state.exportValue = "Attendees on " + this.state.exportDate + ": ";  
            for(var i = 0; i < this.state.attendanceRecord.chain.length; i++)
            {
                var block = this.state.attendanceRecord.chain[i];

                if(block.timestamp == this.state.exportDate && block.club == this.state.exportClub)
                {
                    this.state.exportValue += block.name + " (" + block.grade + "); ";
                }
            }
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
                            </select>
                        </div>

                        <div class="name">
                            <label class ="nameText">Full Name: </label>
                            <input type="text" value={this.state.name} onChange={this.handleNameChange} class="nameForm"/>
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
}
