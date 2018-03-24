# attendance-business-system

A web service for clubs and organizations at Issaquah High School to take attendance and export attendance data <br />

Components: 
-	The database <br />
    o	We use firebase to store attendance data, where we have server-side data validation in addition to client-side. 
-	The web interface to add a new entries to the database <br />
    o	Export data for a specific date, a larger time range, or view data insights on your club members.

Why?
-	Attendance records are easily tampered with as they are modifiable. We want to add integrity to club attendance.
-	Clubs currently use Google Forms or even paper to keep track of attendance, many times creating a new attendance sheet for each meeting. This seems inefficient and messy. We can do better and standardize the system.  <br />
    o	Google Forms data is hard to sort through if a club holds all their attendance in one form. We will enable them to sort through and export their data more efficiently.
