const taskCardTemplate = document.createElement("template");
taskCardTemplate.innerHTML = `
  <link rel="stylesheet" href="./webcomponents/taskCard/taskCard.css">
  
  <div class="taskCard" id="taskCardContainer">
    <div id="textContainer">    
      <h2 id="taskName">Tiempo Libre</h2>
      <span id="timeLeft"><label id="hoursLbl">02</label>h <label id="minsLbl">23</label>min</span>
    </div>
    <img id="pauseBtn" class="timeControler" src="./assets/pause.svg"/>
    <img id="playBtn" class="timeControler" src="./assets/play.svg" />
  </div>`;


class TaskCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(taskCardTemplate.content.cloneNode(true));
    this.originalHours = 2;
    this.originalMins = 23;
    this.lastSeconds = 0;
    this.countdown = null;
    this.id;
  }
  
  connectedCallback() {
    this.shadowRoot.getElementById("playBtn").addEventListener("click", () => {     
      this.startCountdown()
    });

    this.shadowRoot.getElementById("pauseBtn").addEventListener("click", () => {
      this.pauseCountdown()
    });

    this.shadowRoot.querySelector("#taskCardContainer").addEventListener("contextmenu", e => {
        document.getElementById("contextMenu").showContextMenu(e, this);
    });
  }

  removeFromTaskList(){
   
    let taskList = JSON.parse(localStorage.getItem("taskList"));
    let taskListKeys = Object.keys(taskList);
    
    taskListKeys.forEach(day => {
      taskList[day].forEach((task, index) => {
        if(task.id == this.id){     
          document.getElementById(day).resetHours(task.hours, task.mins);
          taskList[day].splice(index, 1);
        }
      });
    });

    localStorage.setItem("taskList", JSON.stringify(taskList));
  }

  setTaskName(taskName) {
    this.shadowRoot.getElementById("taskName").textContent = taskName;
  }

  setTaskId(id){
    this.id = id;
  }

  setTime(hours, mins) {
    this.originalHours = hours;
    this.originalMins = mins;
    this.shadowRoot.getElementById("hoursLbl").textContent = hours.toString().padStart(2, "0");
    this.shadowRoot.getElementById("minsLbl").textContent = mins.toString().padStart(2, "0");
  }

  showPlayBtn() {
    this.shadowRoot.getElementById("playBtn").style.display = "block";
    this.shadowRoot.getElementById("pauseBtn").style.display = "none";
    this.shadowRoot.getElementById("taskCardContainer").style.backgroundColor = "#80ABFF";
  }
  
  showStopBtn() {
    this.shadowRoot.getElementById("playBtn").style.display = "none";
    this.shadowRoot.getElementById("pauseBtn").style.display = "block";
    this.shadowRoot.getElementById("taskCardContainer").style.backgroundColor = "#3B7EFF";
  }

  startCountdown() {
    this.showStopBtn();
    let hours = this.shadowRoot.getElementById("hoursLbl").textContent;
    let mins = this.shadowRoot.getElementById("minsLbl").textContent;
    let totalTime = (parseInt(hours) * 60 + parseInt(mins)) * 60;
    let timeLeft = totalTime + this.lastSeconds;
    
    this.countdown = setInterval(() => {
      timeLeft--;
      let hours = Math.floor(timeLeft / 3600);
      let mins = Math.floor((timeLeft % 3600) / 60);
      this.lastSeconds =timeLeft % 60;
      //console.log("Time left: ", hours, mins, this.lastSeconds);
      
      this.shadowRoot.getElementById("hoursLbl").textContent = hours.toString().padStart(2, "0");
      this.shadowRoot.getElementById("minsLbl").textContent = mins.toString().padStart(2, "0");
      if (timeLeft <= 0) {
        clearInterval(this.countdown);
        this.showPlayBtn();
      }
    }, 1000);

    
  }

  pauseCountdown() {
    this.showPlayBtn();
    clearInterval(this.countdown);

  }

}

customElements.define("task-card", TaskCard);