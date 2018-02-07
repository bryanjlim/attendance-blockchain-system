import * as firebase from 'firebase';
import Block from './Block';
import Timestamp from './Timestamp';

export default class FireBaseHelper
{
    constructor()
    {
        var config = {
            apiKey: "AIzaSyDLrLyawb7-sC86nPa_Y4c4U07oI4gD7bk",
            authDomain: "issaquah-attendance-bloc-c0c08.firebaseapp.com",
            databaseURL: "https://issaquah-attendance-bloc-c0c08.firebaseio.com",
            projectId: "issaquah-attendance-bloc-c0c08",
            storageBucket: "issaquah-attendance-bloc-c0c08.appspot.com",
            messagingSenderId: "706537935134"
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