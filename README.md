# attendance-blockchain-system

A web service for clubs and organizations at Issaquah High School to take attendance and export attendance data. It also happens to store data in a blockchain. <br />

Components: 
-	The attendance blockchain to store attendance data
-	The web interface to add a new block to the blockchain <br />
    o	Export data for a specific date, a larger time range, or view data insights on your club members.
-	The database (which will store the blockchain) <br />
    o	We use firebase to store the blockchain, where we have server-side data validation in addition to client-side. We can verify the blockchain by comparing stored previous and current hashes for each block to what is calculated for it. 

Why?
-	Attendance records are easily tampered with as they are modifiable. Using a blockchain to store attendance data will ensure accurate records due to its immutability.
-	Clubs currently use Google Forms or even paper to keep track of attendance, many times creating a new attendance sheet for each meeting. This seems inefficient and messy. We can do better and standardize the system.  <br />
    o	Google Forms data is hard to sort through if a club holds all their attendance in one form. We will enable them to sort through and export their data more efficiently.
-	A learning experience for high school students to experiment while creating a usable attendance system. 
