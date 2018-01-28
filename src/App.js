import React, { Component } from 'react';
import './App.css';
const SHA256 = require('crypto-js/sha256');

export default class App extends Component {

    constructor() 
    {
        super();
        this.state = {name: '', club:'none', grade:'select', attendanceRecord: new Blockchain(), exportValue: "", exportClub: 'select', exportDates: [<option key={1} value="select">Select A Date</option>], exportDate:''};

        this.handleClubChange = this.handleClubChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleGradeChange = this.handleGradeChange.bind(this);
        this.onSignIn = this.onSignIn.bind(this);

        this.handleExportClubChange = this.handleExportClubChange.bind(this);
        this.repopulateExportDates = this.repopulateExportDates.bind(this);
        this.handleExportDateChange = this.handleExportDateChange.bind(this);
        this.onExport = this.onExport.bind(this);
    }

    componentDidMount() 
    {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 100);
    }

    componentWillUnmount() 
    {
        clearInterval(this.interval);
    }

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

    onSignIn(e) 
    {
        e.preventDefault(); 

        if(this.state.club == "select"){
            alert("Please select a club");
        }
        else if(this.state.name == ""){
            alert("Please enter a name");
        }
        else{
            var date = new Date(); 
            var currentDate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear(); 

            this.state.attendanceRecord.addBlock(new Block(currentDate, this.state.name, this.state.club, this.state.grade)); 

            this.state.name = "";
            this.state.grade = "select"
        }
    }

    handleExportClubChange(newValue){
        this.setState({exportClub: newValue});  
        this.repopulateExportDates(newValue);
    }

    handleExportDateChange(event){
        this.setState({exportDate: event.target.value});
    }

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
                    dates[0] = block.timestamp; 
                }
                else if(block.timestamp != dates[i-1]){
                    dates.push(block.timestamp);
                }
            }
        }

        for(var i = 0; i < dates.length; i++) 
        {
            this.state.exportDates.push(<option key={i+2} value={dates[i]}>{dates[i]}</option>); 
        }
    }

    onExport(e) 
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

                if(block.timestamp == this.state.exportDate)
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

                        <div class ="club"> 
                            <select value={this.state.club} onChange={this.handleClubChange} class="clubSelect">
                                <option value="select">Select a Club</option>
                                <option value="robotics">Robotics Club</option>
                                <option value="code">Code Club</option>
                            </select>
                        </div>

                        <div class="name">
                            <label class ="nameText">Full Name: </label>
                            <input type="text" value={this.state.name} onChange={this.handleNameChange} class="nameForm"/>
                        </div>

                        <div class ="club"> 
                            <select value={this.state.grade} onChange={this.handleGradeChange} class="clubSelect">
                                <option value="select">Select a Grade</option>
                                <option value="Grade 9">9</option>
                                <option value="Grade 10">10</option>
                                <option value="Grade 11">11</option>
                                <option value="Grade 12">12</option>
                            </select>
                        </div>

                        <div class="signInButtonWrapper">
                            <button class="signInButton" onClick={(e) => this.onSignIn(e)}>
                                Sign In
                            </button>
                        </div>

                        <h2><u>Export Attendance Data</u></h2>

                        <div class ="club"> 
                            <select value={this.state.exportClub} onChange={(e) => this.handleExportClubChange(e.target.value)} class="clubSelect">
                                <option value="select">Select a Club</option>
                                <option value="robotics">Robotics Club</option>
                                <option value="code">Code Club</option>
                            </select>
                        </div>

                        <div class ="club"> 
                            <select value={this.state.exportDate} onChange={this.handleExportDateChange} class="clubSelect">
                                {this.state.exportDates}
                            </select>
                        </div>

                        <div class="signInButtonWrapper">
                            <button class="signInButton" onClick={(e) => this.onExport(e)}>
                                Export
                            </button>
                        </div>

                        <p>{this.state.exportValue}</p>

                    </div>

                </form> 

            </div> 
        );
    }
}

class Block
{
    constructor(timestamp, name, club, grade)
    {
        this.timestamp = timestamp;
        this.name = name; 
        this.club = club;
        this.grade = grade; 
        this.previousHash = ''; 
        this.hash = this.calculateHash(); 
    }

    calculateHash()
    {
        return SHA256(this.previousHash + this.timestamp + this.name + this.grade + this.club).toString();
    }

}

class Blockchain
{
    constructor()
    {
        this.chain = [this.createGenesisBlock()]; 
    }

    createGenesisBlock()
    {
        return new Block("0/00/0000", "Bryan Lim", "robotics"); 
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length - 1]; 
    }

    addBlock(newBlock)
    {
        newBlock.previousHash = this.getLatestBlock().hash; 
        newBlock.hash = newBlock.calculateHash(); 
        this.chain.push(newBlock);
    }

    verifyBlockchain()
    {
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false; 
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false; 
            }

            return true;
        }
    }
}
