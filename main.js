window.addEventListener('load', ()=>{
  todos = JSON.parse(localStorage.getItem('todos'))||[];
  DisplayTodos(todos);
  const nameInput = document.querySelector('#name');
  const newTodoForm = document.querySelector('#new-todo-form');
  const username = localStorage.getItem('username') ||'';
  nameInput.value = username;
  nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})
  newTodoForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const todo={
      content: e.target.elements.content.value,
      category: e.target.elements.category.value,
      done: false,
      priority: false,
      createdAt: new Date().getTime()
    }
    todos.push(todo);
    localStorage.setItem('todos',JSON.stringify(todos));
    e.target.reset();
    reorder(todos);
  
  })
  

  //filter querySelector which looks for the HTML elements
  const filterHide = document.querySelector('#Hide');
  const filterShow = document.querySelector('#Show');
  const filterAll = document.querySelector('#All');
  const filterSchool = document.querySelector('#SchoolOnly');
  const filterPersonal = document.querySelector('#PersonalOnly');

  //event listeners that listens for the filter buttons being pressed
  //and calls the filterTodo function and update the display
  filterHide.addEventListener('click',(e)=>{
    const filtered = filterTodos(todos,'done',true);
    DisplayTodos(filtered);
  })
  filterShow.addEventListener('click',(e)=>{
    const filtered = filterTodos(todos,'done',false);
    DisplayTodos(filtered);
  })
  filterShow.addEventListener('click',(e)=>{
    const filtered = filterTodos(todos,'done',false);
    DisplayTodos(filtered);
  })
  filterAll.addEventListener('click',(e)=>{
    reorder(todos);
  })
  filterSchool.addEventListener('click',(e)=>{
    const filtered = filterTodos(todos,'category','school');
    DisplayTodos(filtered);
  })
  filterPersonal.addEventListener('click',(e)=>{
    const filtered = filterTodos(todos,'category','personal');
    DisplayTodos(filtered);
  })

  //detects changes to the search bar and calls the searchTodo function
  const searchInput = document.querySelector("#searchinput");
  searchInput.addEventListener('keyup',(e)=>{
    searchTodo(todos,e.target.value)
  })


  //clear the search result and return to showing all todos
  const clearButton = document.querySelector("#clearbutton");
  clearButton.addEventListener('click',(e)=>{
    searchInput.value = '';
    reorder(todos);
  })
})

//function that filters the todo according to the condition
//returns a filtered list 
function filterTodos(todos,category,condition){
  const list = [];
  for(let i=0; i<todos.length; i++){
      if(todos[i][category] == condition){
        list.push(todos[i])
    }
  }
  reorder(list);
  return list;
}

//function that generate search result in real time for all potential matches
function searchTodo(todos,input){
  const list = [];
  todos.forEach(item=>{
    var s = '';
    for(let x=0; x<input.length;x++){
      s +=item['content'][x];
      if(s==input){
        list.push(item);
        DisplayTodos(list);
      }
    }
  })
  DisplayTodos(list);
}

//reorder the list so that completed todo are at the bottom
function reorder(todos){
  const temp =[];
  for(let i=0; i<todos.length; i++){
    if(todos[i]['done']==false){
      temp.push(todos[i]);
    }
  }
  const list = [];
  for(let i=0; i<temp.length; i++){
    if(temp[i]['priority']==true){
      list.push(temp[i]);
    }
  }
  for(let i=0; i<temp.length; i++){
    if(temp[i]['priority']==false){
      list.push(temp[i]);
    }
  }
  for(let i=0; i<todos.length; i++){
    if(todos[i]['done']==true){
      list.push(todos[i]);
    }
  }
  localStorage.setItem('todos',JSON.stringify(list));
  todos = list;
  DisplayTodos(todos);
}



function DisplayTodos(todos){
  const todoList = document.querySelector('#todo-list');
  todoList.innerHTML ='';

  todos.forEach(todo=>{
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const content = document.createElement('div');
    const actions = document.createElement('div');
    const edit = document.createElement('button');
    const deleteButton = document.createElement('button');
    
    //priority
    const priority = document.createElement('button');
    priority.classList.add('priority');
    priority.innerHTML ="&#9734";

    input.type='checkbox';
    input.checked = todo.done;
    span.classList.add('bubble');

    if(todo.category == 'personal'){
      span.classList.add('personal');
    }else{
      span.classList.add('school');
    }

    content.classList.add('todo-content');
    actions.classList.add('actions');
    edit.classList.add('edit');
    deleteButton.classList.add('delete');

		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
    edit.innerHTML = "Edit";
    deleteButton.innerHTML = "Delete";

    label.appendChild(input);
    label.appendChild(span);
    //append priority
    actions.appendChild(priority);
    actions.appendChild(edit);
    actions.appendChild(deleteButton);
    todoItem.appendChild(label);
    todoItem.appendChild(content);
    todoItem.appendChild(actions);
    

    todoList.appendChild(todoItem);

    if(todo.done){
      todoItem.classList.add('done');
    }
  
    input.addEventListener('change',e=>{
      todo.done = e.target.checked;
      localStorage.setItem('todos', JSON.stringify(todos));

      if(todo.done){
        todoItem.classList.add('done');
      }else{
        todoItem.classList.remove('done');
      }
      reorder(todos);
    })

    //priority class update
    if(todo.priority){
      priority.classList.remove('priority');
      priority.classList.add('priority-yes');
      priority.innerHTML = "&#9733";
    }
    //priority event listener 
    priority.addEventListener('click',(e)=>{
      if(todo.priority){
        todo.priority = false;
      }else{
        todo.priority = true;
      }
      localStorage.setItem('todos', JSON.stringify(todos));
      if(todo.priority){
        priority.classList.remove('priority');
        priority.classList.add('priority-yes');
        priority.innerHTML = "&#9733";
      }else{
        priority.classList.remove('priority-yes');
        priority.classList.add('priority');      
        priority.innerHTML ="&#9734";
      }
      reorder(todos);
    })


    edit.addEventListener('click',e=>{
      const input = content.querySelector('input');
      input.removeAttribute('readonly');
      input.focus();
      input.addEventListener('blur',e=>{
        input.setAttribute('readonly',true);
        todo.content = e.target.value;
        localStorage.setItem('todos',JSON.stringify(todos));
        DisplayTodos(todos);
      })
    })

    deleteButton.addEventListener('click', e=>{
      todos = todos.filter(t=>t !=todo);
      localStorage.setItem('todos',JSON.stringify(todos));
      DisplayTodos(todos);
    })
  })
}

