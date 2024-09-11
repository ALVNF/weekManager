const taskListTemplate = document.createElement("template");
taskListTemplate.innerHTML = `
  <link rel="stylesheet" href="./webcomponents/taskList/taskList.css">
  
  <div class="taskListContainer">
    <div class="weekDaysContainer">
        <label class="weekDay selected">L</label>
        <label class="weekDay">M</label>
        <label class="weekDay">X</label>
        <label class="weekDay">J</label>
        <label class="weekDay">V</label>
        <label class="weekDay">S</label>
        <label class="weekDay">D</label>
    </div>

    <div class="tasksContainer">

    </div>
  </div>`;


class TaskList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(taskListTemplate.content.cloneNode(true));
    }
  
    connectedCallback() {
        this.shadowRoot.querySelectorAll(".weekDay").forEach((day) => {
            day.addEventListener("click", this.changeSelectedDay.bind(this));
        });
    }

    loadDay(todaysDay) {
        this.shadowRoot.querySelectorAll(".weekDay").forEach((day) => {           
            if(day.textContent == todaysDay){
                day.classList.add("selected");
            }else{
                day.classList.remove("selected");
            }
        });    
    }

    
    changeSelectedDay(event) {
        this.shadowRoot.querySelectorAll(".weekDay").forEach((day) => {
            day.classList.remove("selected");
        });

        this.loadTasks(event.target.textContent);
        event.target.classList.add("selected");
    }

    getSelectedDay() {
        return this.shadowRoot.querySelector(".weekDay.selected").textContent;
    }

    addTask(task) {
        // Add task to the list
        this.shadowRoot.querySelector(".tasksContainer").appendChild(task);
    }

    loadTasks(day) {        
        // Clear the list
        this.shadowRoot.querySelector(".tasksContainer").innerHTML = "";
        // Load tasks from local storage
        let taskList = JSON.parse(localStorage.getItem("taskList"));
        if (taskList == null) {
            return;
        }

        let tasks = taskList[day];
        if (tasks == null) {
            return;
        }
        tasks.forEach(task => {
            let taskCard = document.createElement("task-card");
            taskCard.setTaskName(task.name);
            taskCard.setTime(task.hours, task.mins);
            taskCard.setTaskId(task.id);
            this.addTask(taskCard);
        });
    }



}

customElements.define("task-list", TaskList);