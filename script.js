const taskForm = document.getElementById('task-form')
const taskInput = document.getElementById('task-input')
const taskList = document.getElementById('task-list')
const filterButtons = document.querySelectorAll('.filter-btn')


let currentFilter = 'all'

let taskReminders = {}


function saveTasksToStorage(){
    const tasks = taskList.querySelectorAll('li')


    const taskData =[]


    tasks.forEach(task =>{
         const taskText = task.querySelector('.task-text').textContent

         const isCompleted = task.getAttribute('data-completed')=== 'true'

         const taskObject ={
            text:taskText,
            completed:isCompleted
         }

         taskData.push(taskObject)
    })

    localStorage.setItem('studentTasks', JSON.stringify(taskData))

    console.log('tasks saved to local storage', taskData)
}


function loadTasksFromStorage(){
    const savedTasks = localStorage.getItem('studentTasks')


    if(savedTasks){
        const taskData = JSON.parse(savedTasks)


         taskList.innerHTML = ''

         taskData.forEach(task =>{
            addTaskToPage(task.text,task.completed)
         })
         console.log('tasks loaded from local storage',taskData)
    }else{
        console.log('no task found in the local storage')
    }
}


function addTaskToPage(taskText,isCompleted = false){
    const li = document.createElement('li')

    li.setAttribute('data-completed',isCompleted ? 'true' :'false')

    if(isCompleted){
        li.classList.add('completed')
    }


    li.innerHTML=`
        <input type="checkbox"  class = 'task-checkbox' ${isCompleted ? 'checked' : ''}/>
    <span class="task-text">${taskText}</span>
    <div class="actions">
      <button class="complete-btn" title="Mark as Complete">✓</button>
      <button class="reminder-btn" title="Set Reminder">⏰</button>
      <button class="edit" title="Edit">✏️</button>
      <button class="delete-btn" title="Delete Task">✖</button>
    </div>
    `;


    taskList.appendChild(li)
}

function addTask(taskText){
   addTaskToPage(taskText,false)

   saveTasksToStorage()

}


taskForm.addEventListener('submit',function(e){
    e.preventDefault()


    const taskText = taskInput.value.trim();

    if(taskText !==''){
        addTask(taskText)


        taskInput.value='';

        taskInput.focus()
    }

})

function filterTasks(filter){
    const task = taskList.querySelectorAll('li');


    task.forEach(task=>{
        const isCompleted = task.getAttribute('data-completed') ==='true' || task.classList.contains('completed')



        switch(filter){
         case 'all':

            task.style.display = 'flex'
            break;
         case 'pending':
            task.style.display = isCompleted ? 'none' : 'flex'
            break;

        case 'completed':
            task.style.display = isCompleted ? 'flex' : 'none'
            break;

        }
    })
}

filterButtons.forEach(button =>{
    button.addEventListener('click', function(){

        filterButtons.forEach(btn => btn.classList.remove('active'))

        this.classList.add('active')
         
         const filter = this.getAttribute('data-filter')
        currentFilter= filter


        filterTasks(filter)
    })
})


function setTaskReminder(taskElement,minutes){
    const taskText = taskElement.querySelector('.task-text').textContent

    const taskId = Date.now() + Math.random()

    taskElement.setAttribute('data-task-id',taskId)

    const milliseconds = minutes *60*1000

    console.log(`setting reminder for "${taskText}"`)

    const timerId = setTimeout(()=>{
        alert(`REMINDER:time to work on "${taskText}"`)

        delete taskReminders(taskId)
    },milliseconds)

    taskReminders[taskId] = timerId
}

function cancelReminder(taskId){
    if(taskReminders[taskId]){

        clearTimeout(taskReminders[taskId])

        delete taskReminders[taskId]

        console.log('reminder cancelled for task ID:',taskId)
    }
}



taskList.addEventListener('click',function(e){
    const clickedElement = e.target;

    const taskItem = clickedElement.closest('li');




    if (clickedElement.classList.contains('delete-btn')){

        const taskId = taskItem.getAttribute('data-task-id')

        if(taskId){
            cancelReminder(taskId)
        }
        taskItem.remove()
        saveTasksToStorage()
    }


    else if(clickedElement.classList.contains('complete-btn')){
        const checkbox = taskItem.querySelectorAll('.task-checkbox')


        const isCurrentlyCompleted = this.taskItem.getAttribute('data-completed') ==='true'


        if(isCurrentlyCompleted){
            taskItem.setAttribute('data-completed','false')
            taskItem.classList.remove('completed')

            checkbox.checked =false;
        }
        else{
            taskItem.setAttribute('data-completed','true')
            taskItem.classList.add('completed')
            checkbox.checked=true;
        }
        saveTasksToStorage()
        filterTasks(currentFilter)
    }

    else if(clickedElement.classList.contains('task-checkbox')){
        const isChecked = clickedElement.checked;

        if(isChecked){
            taskItem.setAttribute('data-completed','true');
            taskItem.classList.add('completed')
        }
        else{
            taskItem.setAttribute('data-completed','false')
            taskItem.classList.remove('completed')

        }
        saveTasksToStorage()
        filterTasks(currentFilter)
    }

    else if (clickedElement.classList.contains('reminder-btn')){
        const taskText = taskItem.querySelector('.task-text').textContent

        const minutes = prompt(`set reminder for "${taskText}" \nEnter minutes from now:`)
         if(minutes && !isNaN(minutes) && minutes > 0){
            setTaskReminder(taskItem, parseInt(minutes))

            clickedElement.style.color ='#f59e0b'

            clickedElement.title = `reminder set for ${minutes} minutes`

            setTimeout(()=>{
                clickedElement.title= 'setReminder'
            },2000)
         }

         else if(minutes !==null ){
            alert ('please enter a valid number of minutes')
         }
    }
    else if(clickedElement.classList.contains('edit')) {
        editTask(taskItem)
    }
})
const editTask = (taskItem) => {
    const taskElement = taskItem.querySelector('.task-text') 
    const currentText = taskElement.textContent

    const editInput = document.createElement('input')
    editInput.type = 'text'
    editInput.value = currentText
    editInput.className = 'edit-input'

    taskElement.replaceWith(editInput)
    editInput.focus()

    //Store edited Text
    const saveEdited = () => {
    const newText = editInput.value.trim()
    if(newText && newText !== currentText) {
        const newTaskElement = document.createElement('span')
        newTaskElement.className = ('task-text')
        newTaskElement.textContent = (newText)
        editInput.replaceWith(newTaskElement)
        saveTasksToStorage()
    } else {
        editInput.replaceWith(taskElement)
    }
}   
    editInput.addEventListener('keyup', (e) => {
        if(e.key === 'Enter') {
            saveEdited()
        } else if(e.key === 'Escape') {
            editInput.replaceWith(taskElement)
        }
    })
}

document.addEventListener('DOMContentLoaded',function(){
loadTasksFromStorage()
})