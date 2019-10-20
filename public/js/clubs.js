// Enumeration for sign in fields
var fields = Object.freeze({
    NAME: "Name",
    GRADE: "Grade", 
    ASBNUMBER: "ASB Number",
    EMAIL: "Email", 
    BOOLEAN: "Boolean", 
    PARAGRAPH: "Paragraph",
    DATE: "Selected Date" // Optional
}); 

class Club{
    constructor(clubName, shortHandName, chosenFields, booleanInstruction, paragraphInstruction)
    {
        this.clubName = clubName;
        this.shortHandName = shortHandName; 
        this.chosenFields = chosenFields; 

        // Instructions for the boolean field
        this.booleanInstruction = booleanInstruction; 

        // Instructions for the text area field
        this.paragraphInstruction = paragraphInstruction; 
    }
}


var clubList = [
    new Club("Astronomy Club","astronomy", [fields.NAME, fields.GRADE]), 
    new Club("Code Club","code", [fields.NAME, fields.GRADE]),
    new Club("Creative Writing Club","creativewriting", [fields.NAME, fields.EMAIL, fields.DATE, fields.GRADE]),
    new Club("Engineering Club","engineering", [fields.NAME, fields.GRADE]),
    new Club("French Club","french", [fields.NAME, fields.GRADE]),
    new Club("Girls Who Code","girlswhocode", [fields.NAME, fields.GRADE]),
    new Club("Green Team","green", [fields.NAME, fields.GRADE]),
    new Club("Hiking Club","hiking", [fields.NAME, fields.GRADE]),
    new Club("Japanese Club","japanese", [fields.NAME, fields.GRADE]),
    new Club("Junior State of America","JSA", [fields.NAME, fields.GRADE]),
    new Club("National Honor Society","NHS", [fields.NAME, fields.GRADE]),
    new Club("Radio Club", "radio", [fields.NAME, fields.GRADE]),
    new Club("Issaquah Robotics Society","robotics", [fields.NAME, fields.GRADE]),
    new Club("Starkiller Base","starkillerbase", [fields.NAME, fields.GRADE]),
    new Club("Test Club (For Maintenence)","test", [fields.NAME, fields.ASBNUMBER, fields.EMAIL, fields.PARAGRAPH, fields.BOOLEAN, fields.DATE, fields.GRADE], "Test Boolean Instruction", "Test Paragraph Instruction"),
    new Club("Issaquah Debate Team", "debateteam", [fields.NAME, fields.GRADE]),
    new Club("Issaquah Film Club", "IFC", [fields.NAME, fields.GRADE]),
    new Club("Sports Med Club", "SMed", [fields.NAME, fields.GRADE]),
    new Club("Model UN Club", "MUN", [fields.NAME, fields.GRADE]),
    new Club("Issaquah DECA Club", "deca", [fields.NAME, fields.GRADE]),
    new Club("Japanese Club", "japanc", [fields.NAME, fields.GRADE])
	];