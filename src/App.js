import React, { Component } from 'react';
import './App.css';
const SHA256 = require('crypto-js/sha256');

export default class App extends Component {

    constructor() 
    {
        super();
        this.state = {name: '', club:'none', attendanceRecord: new Blockchain(), blockchainstring: ""};

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.onButtonPress = this.onButtonPress.bind(this);
    }

    componentDidMount() 
    {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
    }

    componentWillUnmount() 
    {
        clearInterval(this.interval);
    }

    handleSelectChange(event) 
    {
        this.setState({club: event.target.value});
    }

    handleFormChange(event) 
    {
        this.setState({name: event.target.value});
    }

    onButtonPress(e) 
    {
        e.preventDefault(); 

        if(this.state.club == "none"){
            alert("Please select a club");
        }
        else if(this.state.name == ""){
            alert("Please enter a name");
        }
        else{
            var date = new Date(); 
            var currentDate = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear(); 

            this.state.attendanceRecord.addBlock(new Block(currentDate, this.state.name, this.state.club)); 
            
            this.state.blockchainstring = (JSON.stringify(this.state.attendanceRecord, null, 4));
            alert("Blockchain Validity: " + this.state.attendanceRecord.verifyBlockchain());
        }
    }

    render() {
        return (
            <div class="mainScreen">

                <form>

                    <h1 class="title">Attendance Blockchain System</h1>

                    <div class="centerWrapper">

                        <div class ="club"> 
                            <select value={this.state.club} onChange={this.handleSelectChange} class="clubSelect">
                                    <option value="none">Select a Club</option>
                                    <option value="robotics">Robotics Club</option>
                                    <option value="code">Code Club</option>
                            </select>
                        </div>

                        <div class="name">
                            <label class ="nameText">Full Name: </label>
                            <input type="text" value={this.state.name} onChange={this.handleFormChange} class="nameForm"/>
                        </div>

                        <div class="signInButtonWrapper">
                            <button class="signInButton" onClick={(e) => this.onButtonPress(e)}>
                                Sign In
                            </button>
                        </div>

                        <p>{this.state.blockchainstring}</p>

                    </div>

                </form> 

            </div> 
        );
    }
}

class Block
{
    constructor(timestamp, name, club)
    {
        this.timestamp = timestamp;
        this.name = name; 
        this.club = club;
        this.previousHash = ''; 
        this.hash = this.calculateHash(); 
    }

    calculateHash()
    {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
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
