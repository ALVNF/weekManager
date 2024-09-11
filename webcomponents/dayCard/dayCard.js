const dayCardTemplate = document.createElement("template");
dayCardTemplate.innerHTML = `
  <link rel="stylesheet" href="./webcomponents/dayCard/dayCard.css">
  
  <div class="dayCard">
    <h2 id="dayName">Lunes</h2>
    <span id="hoursRemaining">Tiempo por asignar: 
        <label class="time" id="hoursLbl">16</label>h 
        <label class="time" id="minsLbl">00 </label>min
    </span>
  </div>`;


class DayCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(dayCardTemplate.content.cloneNode(true));

        this.maxHours = 16;
        this.remainingHours = 16;
        this.maxMins = 60;
        this.remainingMins = 0;

    }
  
    connectedCallback() {
        //this.changeHoursRemaining(0,0);
        //this.checkHoursRemaining();
        this.setDayName(this.getAttribute("day"));
        this.updateTimeRemaing(0,0);
    }

    setDayName(dayName) {
        this.shadowRoot.getElementById("dayName").textContent = dayName;
    }

    getDayName() {
        return this.shadowRoot.getElementById("dayName").textContent
    }

    setHoursRemaining() {
        this.shadowRoot.getElementById("hoursLbl").innerHTML = this.remainingHours;
    }
    
    setMinsRemaining() {
        this.shadowRoot.getElementById("minsLbl").innerHTML = this.remainingMins;
    }

    setMaxHours(maxHours) {
        this.maxHours = maxHours;
    }

    // Check hoursRemaining and update the color of the card
    checkHoursRemaining() {
        
        const hoursRemaining = this.shadowRoot.getElementById("hoursLbl").textContent;
        
        if (hoursRemaining == 0) {
            this.shadowRoot.querySelector(".dayCard").style.backgroundColor = "#C8FFD4";
        } else if(hoursRemaining >= 1 && hoursRemaining <= this.maxHours - 10) {
            this.shadowRoot.querySelector(".dayCard").style.backgroundColor = "#D9FFC8";
        }else if(hoursRemaining <= this.maxHours -5) {
            this.shadowRoot.querySelector(".dayCard").style.backgroundColor = "#FFE5C8";
        }else{
            this.shadowRoot.querySelector(".dayCard").style.backgroundColor = "#FFC8C8";
        }
    }

    updateTimeRemaing(newHours, newMins){
        let day = this.shadowRoot.getElementById("dayName").textContent;
        let hours = newHours;
        let mins = newMins;
        let shortDay = day.substring(0,1);
        if(day=="Miércoles"){
            shortDay = "X";
        }

        
    
        
        if(this.changeHoursRemaining(hours, mins)){
            return true;
        }else{
            return false;
        }
    }

    loadHours(){
        let taskList = JSON.parse(localStorage.getItem("taskList"));
        let day = this.shadowRoot.getElementById("dayName").textContent;
        let hours = 0;
        let mins = 0;
        let shortDay = day.substring(0,1);
        if(day=="Miércoles"){
            shortDay = "X";
        }

        if(taskList != null){
            taskList[shortDay].forEach(task => {              
                hours += parseInt(task.hours);
                mins += parseInt(task.mins);
            });
        }
        
        this.changeHoursRemaining(hours, mins)
    }


    changeHoursRemaining(addedHours, addedMins) {

        if(this.remainingHours - addedHours < 0 || (this.remainingHours == 0 && this.remainingMins == 0)){
            this.checkHoursRemaining();
            return false;
        }else{

            this.remainingHours -=  addedHours;
            this.remainingMins -= addedMins;
            if(this.remainingMins < 0){
                this.remainingMins += 60;
                this.remainingHours -= 1;
            }

            this.setHoursRemaining();
            this.setMinsRemaining();
            this.checkHoursRemaining();
            return true;
        }
        
    }

    resetHours(addedHours, addedMins) {

       

        this.remainingHours +=  parseInt(addedHours);
        this.remainingMins += parseInt(addedMins);

        if(this.remainingMins >= 60){
            this.remainingMins -= 60;
            this.remainingHours += 1;
        }

        this.setHoursRemaining();
        this.setMinsRemaining();
        this.checkHoursRemaining();
        return true;
        
    }



}

customElements.define("day-card", DayCard);