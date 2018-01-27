# attendance-blockchain-system

A web service for clubs and organizations at Issaquah High School to take attendance and export attendance data. It also happens to utlize a blockchain (that is not decentralized yet). <br />

Uses ReactJS and crypto-js <br />

Components: 
-	The attendance blockchain to store attendance data
-	The web interface to add a new block to the blockchain <br />
    o	Will also be able to view and export data for a specific club on a specific date
-	The database (which will store the blockchain) <br />
    o	We do not currently have nodes or mine, and will be simply using MongoDB. If someone tampers with the data, the blockchain will be able to detect it due to a mismatch in a current or previous block’s expected and current hash. We do not expect high school students to go through the trouble of recalculating the hashes of every block just to modify attendance records. 

Why?
-	Attendance records are easily tampered with as they are modifiable. Using a blockchain to store attendance data will ensure accurate records due to its immutability.
-	Clubs currently use Google Forms to keep track of attendance, many times creating a new one for each meeting. This seems inefficient and clutters Google Drive space. We can do better. <br />
    o	Google Forms data is hard to sort through if a club holds all their attendance in one form. We will enable them to sort through and export their data more efficiently.
-	A learning experience for high school students to experiment while creating a usable attendance system. 
