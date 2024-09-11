const taskFormTemplate = document.createElement("template");
taskFormTemplate.innerHTML = `
  <link rel="stylesheet" href="./webcomponents/taskForm/taskForm.css">
  
  <div class="taskFormContainer">
    <div class="questionContainer">
      <label>Nombre de la tarea</label>
      <input type="text" id="taskName" value="test" placeholder="Nombre de la tarea">
    </div>

    <div class="questionContainer">
      <label>¿Cuánto tiempo quiero dedicarle?</label>
      <div>
        <input type="number" id="taskTime" value="1"><label>horas</label>
        <input type="number" id="taskMin" value="0"><label>minutos</label>
      </div>
    </div>

    <div class="questionContainer">
      <label>Selecciona los días que quieres hacer la tarea</label>
      <div class="weekDaysContainer">
          <label class="weekDay ">L</label>
          <label class="weekDay ">M</label>
          <label class="weekDay ">X</label>
          <label class="weekDay ">J</label>
          <label class="weekDay ">V</label>
          <label class="weekDay ">S</label>
          <label class="weekDay ">D</label>
      </div> 
    </div>

    <div class="btnsContainer">
      <button id="addTask">Añadir tarea</button>
      <button id="cancelTask">Cancelar</button>
    </div>
  </div>

`;


class TaskForm extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(taskFormTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelectorAll(".weekDay").forEach((day) => {
      day.addEventListener("click", this.toggleDay.bind(this));
    });

    this.shadowRoot.querySelector("#addTask").addEventListener("click", () => {
      this.newTask();
      closeTaskForm();
    });

    this.shadowRoot.querySelector("#cancelTask").addEventListener("click", () => {
      closeTaskForm();
    });
  }

  toggleDay(event) {
    if (event.target.classList.contains("selected")) {
      event.target.classList.remove("selected");
    } else {
      event.target.classList.add("selected");
    }
  }

  newTask(){
    let task = {
      name: this.shadowRoot.querySelector("#taskName").value,
      hours: this.shadowRoot.querySelector("#taskTime").value,
      mins: this.shadowRoot.querySelector("#taskMin").value,
      days: Array.from(this.shadowRoot.querySelectorAll(".weekDay.selected")).map(day => day.innerText)
    }     

    let initial = "";
    task.days.forEach(day => {
      if(day == "Miércoles"){       
        initial = "X";
      }else{
        initial = day.substring(0,1);
      }
      
      let cardItem = document.getElementById(initial);
        
      if(cardItem.updateTimeRemaing(task.hours, task.mins)){
        saveTaskData(task, day);
      }

      
    });


    // document.querySelectorAll("day-card").forEach(dayCard => {
    //   let initial ="";
  
    //   if(dayCard.getDayName() == "Miércoles"){
    //     initial = "X";
    //   }else{
    //     initial = dayCard.getDayName().substring(0,1);
    //   }

    //   // if(task.days.includes(initial)){
    //   //   if(dayCard.updateTimeRemaing(task.hours, task.mins)){
    //   //     saveTaskData(task);
    //   //     task.days.splice(task.days.indexOf(initial), 1);
    //   //   }
    //   // }
      
    //   // task.days.forEach(day => {
    //   //   if(initial == day) {
    //   //     if(dayCard.updateTimeRemaing(task.hours, task.mins)){
    //   //       saveTaskData(task);
    //   //       task.days.splice(task.days.indexOf(day), 1);
    //   //     }else{
    //   //       task.days.splice(task.days.indexOf(day), 1);
    //   //     }
    //   //   }
    //   // });

    // });
    
    
  }


}

customElements.define("task-form", TaskForm);