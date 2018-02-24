// Enumeration for sign in fields
var fields = Object.freeze({
    NAME: 1,
    GRADE: 2, 
    ASBNUMBER: 3,
    EMAIL: 4, 
    BOOLEAN: 5, 
    TEXTAREA: 6
}); 

class Club{
    constructor(clubName, shortHandName, chosenFields, booleanInstruction, textareaInstruction)
    {
        this.clubName = clubName;
        this.shortHandName = shortHandName; 
        this.chosenFields = chosenFields; 

        // Instructions for the boolean field
        this.booleanInstruction = booleanInstruction; 

        // Instructions for the text area field
        this.textareaInstruction = textareaInstruction; 
    }
}


var clubList = [
    new Club("Astronomy Club","astronomy", [fields.NAME, fields.GRADE]), 
    new Club("Code Club","code", [fields.NAME, fields.GRADE]),
    new Club("Creative Writing Club","creativewriting", [fields.NAME, fields.GRADE]),
    new Club("French Club","french", [fields.NAME, fields.GRADE]),
    new Club("Girls Who Code","girlswhocode", [fields.NAME, fields.GRADE]),
    new Club("Green Team","green", [fields.NAME, fields.GRADE]),
    new Club("Hiking Club","hiking", [fields.NAME, fields.GRADE]),
    new Club("Japanese Club","japanese", [fields.NAME, fields.GRADE]),
    new Club("Junior State of America","JSA", [fields.NAME, fields.GRADE]),
    new Club("National Honor Society","NHS", [fields.NAME, fields.GRADE]),
    new Club("Robotics Club","robotics", [fields.NAME, fields.GRADE]),
    new Club("Starkiller Base","starkillerbase", [fields.NAME, fields.GRADE]),
    new Club("Test Club (Beta Testing)","test", [fields.NAME, fields.GRADE]),
]