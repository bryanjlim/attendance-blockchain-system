import * as firebase from 'firebase';
import Block from './Block';
import Blockchain from './Blockchain'; 
import Timestamp from './Timestamp';

export default class FireBaseHelper
{
    constructor()
    {
        var config = {
            apiKey: "AIzaSyDukhtNGwrBJmT25Tnuj5XMlfC4pV5n9fE",
            authDomain: "attendanceblockchainsystem.firebaseapp.com",
            databaseURL: "https://attendanceblockchainsystem.firebaseio.com",
            projectId: "attendanceblockchainsystem",
            storageBucket: "attendanceblockchainsystem.appspot.com",
            messagingSenderId: "1083154364354"
          }
        firebase.initializeApp(config);
        this.databaseRef = firebase.database().ref(); 
    }

    // Pulls blockchain from database
    updateBlockchain(blockchain){
        this.databaseRef.once("value", function(snapshot){
            var blocks = []; 
            
            snapshot.forEach(function(data){
                var block = new Block(data.val().name, 
                                      data.val().asbNumber, 
                                      data.val().club, 
                                      data.val().grade, 
                                      new Timestamp(data.val().timestamp.day,data.val().timestamp.month,data.val().timestamp.year), 
                                      data.val().previousHash, 
                                      data.val().hash
                                    );
                blocks.push(block);
            })
            blockchain.chain = blocks; 
        })
    } 

    // Adds singular block to database
    addBlockToDatabase(block, blockchain){
        block.previousHash = blockchain.getLatestBlock().hash;  

        var currentTime = new Timestamp();
        currentTime.setCurrentTime(); 
        block.timestamp = currentTime; 

        block.hash = block.calculateHash(); 
        this.databaseRef.push(block);
    }
}