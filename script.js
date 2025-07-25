const taskForm = document.getElementById('task-form')
const taskInput = document.getElementById('task-input')
const taskList = document.getElementById('task-list')
const filterButtons = document.querySelectorAll('.filter-btn')


let currentFilter = 'all'



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


    li.innerHTML=`
        <input type="checkbox"  class = 'task-checkbox' ${isCompleted ? 'checked' : ''}/>
    <span class="task-text">${taskText}</span>
    <div class="actions">
      <button class="complete-btn" title="Mark as Complete">✓</button>
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

taskList.addEventListener('click',function(e){
    const clickedElement = e.target;

    const taskItem = clickedElement.closest('li');


    if (clickedElement.classList.contains('delete-btn')){
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
})


document.addEventListener('DOMContentLoaded',function(){
loadTasksFromStorage()
})