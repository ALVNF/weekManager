document.addEventListener("DOMContentLoaded", function() {
 
    loadSleepData();
    loadTasks();
    loadDayTime();
});

function loadDayTime(){
    let dayCards = document.querySelectorAll("day-card");
    dayCards.forEach(dayCard => {

        dayCard.loadHours();
    });
}

function loadTasks() {
    const narrowDayName = (date, locale) =>
        date.toLocaleDateString(locale, { weekday: 'narrow' });
    narrowDayName(new Date()) // D
    let taskListComponent = document.getElementById("taskList");
    taskListComponent.loadDay(narrowDayName(new Date()));
    taskListComponent.loadTasks(narrowDayName(new Date()));
}

function openTaskForm() {
    document.getElementById("dialogContainer").style.display = "block";  
}

function closeTaskForm() {
    document.getElementById("dialogContainer").style.display = "none";  
}

function calculateWakeUp(){
    const sleepTime = document.getElementById("sleepTime").value;
    const sleepHours = document.getElementById("sleepHours").value;
    let wakeTime = document.getElementById("wakeHours");
    let wakeDate = new Date();

    wakeDate.setHours((parseInt(sleepTime.trim().split(":")[0]) + parseInt(sleepHours)))
    wakeDate.setMinutes(sleepTime.trim().split(":")[1]);

    hour = (wakeDate.getHours() < 10 ? "0" : "") + wakeDate.getHours();
    min = (wakeDate.getMinutes() < 10 ? "0" : "") + wakeDate.getMinutes();
    
    wakeTime.value = hour + ":" + min;
    calculateMaxHoursDay(sleepHours);
}

function calculateMaxHoursDay(sleepHours){

    let maxHours = 24 - parseInt(sleepHours);
    document.getElementById("maxHours").innerText = maxHours;
    saveSleepData();
}

function saveTaskData(task,day){
    
    let taskList = JSON.parse(localStorage.getItem("taskList"));
    if(taskList == null){
        taskList = {
            "L": [],
            "M": [],
            "X": [],
            "J": [],
            "V": [],
            "S": [],
            "D": []
        };
    }
    let taskCopy = Object.assign({}, task);
    //Remove task.days from taskCopy
    delete taskCopy.days;
    
    //Add unique id to task
    taskCopy.id = Math.floor(Math.random() * 1000000);
    taskList[day].push(taskCopy);
    
    
    localStorage.setItem("taskList", JSON.stringify(taskList));
    document.getElementById("taskList").loadTasks(document.getElementById("taskList").getSelectedDay());
}

function saveSleepData(){
    let sleepTime = document.getElementById("sleepTime").value;
    let sleepHours = document.getElementById("sleepHours").value;
    localStorage.setItem("sleepTime", sleepTime);
    localStorage.setItem("sleepHours", sleepHours);
}

function loadSleepData(){
    let sleepTime = localStorage.getItem("sleepTime");
    let sleepHours = localStorage.getItem("sleepHours");
    document.getElementById("sleepTime").value = sleepTime;
    document.getElementById("sleepHours").value = sleepHours;
    calculateWakeUp();
}