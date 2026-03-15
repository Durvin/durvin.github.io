//npcs.push(New NPC())

var anmaoTestDialogue = new DialogueTree({
    greeting: ["Hello, i'm DOg, which is with an O and not a 0"],
    currentText: "",
    repeatGreeting: ["play in the sky"],
    textPosition: 0,
    owner: null,
    stateProcessor(){
        if(!this.owner.greeted){
            this.owner.greeted = true;
            currentText = this.greeting;
            this.text.currentText = this.greeting;
            this.text.textPosition = 0;
        }
        if(this.owner.nextCheck !== null){
            if(this.text[this.owner.nextCheck].length > position+1){
                this.text.currentText = this.text[this.owner.nextCheck][0];
                this.text.textPosition++;
            }
        }
        else{
            this.currentText = repeatGreeting;
            this.text.textPosition = 0;
        }

        return this.currentText[currentText[textPosition]];
    }
}, npcs[npcs.length-1]);