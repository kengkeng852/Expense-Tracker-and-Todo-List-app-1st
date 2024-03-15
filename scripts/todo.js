//choose element
const InputTodo = document.getElementById('newtodoinput');
const TodoEl = document.getElementById('todolist');
const TodoForm  = document.getElementById('todoform');

let todos = JSON.parse(localStorage.getItem('todos'))|| []; // to check if there are todos elements already or not inside local storage
let editTodoId = -99;

renderTodos(); //fisrt render if there are todos elements in storage

TodoForm.addEventListener('submit',function (e){
    e.preventDefault();
    saveTodo();
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos)); //convert to string then save to local storage
});

//action for all todo button
TodoEl.addEventListener('click',function (e){
    const target = e.target;
    const parentElement = target.parentNode;

    const todo = parentElement; //get all todo element from that todo
    const id = Number(todo.id);

    const action = target.getAttribute('data-action');

    switch(action) {
        case 'tocheck':
            checkTodo(id);
            break;
        case 'toedit':
            editTodo(id);
            break;
        case 'todelete':
            deleteTodo(id);
            break;
    }
    
})


//save Todo
function saveTodo(){
    const todoValue = InputTodo.value; // take value from input id = "newtodoinput"

    // check if the todo is empty
    const isEmpty = todoValue === '';

    // check for duplicates if there any uppercase or lowercase this todolist 
    const isDuplicate = todos.some((todo)=> todo.value.toUpperCase() === todoValue.toUpperCase());

    if(isEmpty || isDuplicate){
        return;
    }
    else {
        if(editTodoId >= 0) { // if user what to edit todo
            //update Todo
            todos = todos.map((todo,index) => {
                return{
                    value: index === editTodoId ? todoValue : todo.value, //todoValue is updated todo and todo.value is previous value
                    checked: todo.checked
                }
            })
            editTodoId = -99; //set to default value which not have to edit
        }
        else {
            const todo ={
                value: todoValue,
                checked: false //doesn't done yet
            }
            todos.push(todo);
        }
        InputTodo.value =''; //reset todo value
    }
}

//render TodoList
function renderTodos(){
    if(todos.length === 0){
        TodoEl.innerHTML = '<h2>Nothing to do!</h2>'
        return;
    }
    TodoEl.innerHTML = ''; //to not print the previous todos

    //render 
    todos.forEach((todo,index) =>{
        TodoEl.innerHTML += `
        <div class="todo" id=${index}> 
                <i class = 'bi ${todo.checked ? 'bi-check-circle-fill': 'bi-circle'}' 
                    data-action = 'tocheck'> </i>
                <p class="${todo.checked ? 'checked': 'notcheck'}">${todo.value}</p>
                <i class="bi bi-pencil-square" data-action='toedit'></i>
                <i class="bi bi-trash" data-action = 'todelete' ></i>
        </div>`
    })
}


//edit todo
function editTodo(id){
    InputTodo.value = todos[id].value;
    editTodoId = id;
}

//delete todo
function deleteTodo(id){
    todos.splice(id,1); //at index number id delete that value out at 1 value which is itself
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
}

//check todo
function checkTodo(id){
    todos = todos.map((todo,index)=> {
        return {
            value: todo.value,
            checked: index === id ? !todo.checked : todo.checked //reverse check value
        }
    })
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
}


renderTodos();

return (
    <div className="container">
      <div className="todobox">
        <div className="head">
          <h2>Todo List</h2>
        </div>
        <div className="newtodo">
          <form id="todoform" onSubmit={handleTodoSubmit}>
            <input
              type="text"
              id="newtodoinput"
              value={newTodoValue}
              onChange={(e) => setNewTodoValue(e.target.value)}
            />
            <button type="submit">
              <i className="bi bi-plus-circle-dotted"></i>
            </button>
          </form>
        </div>
        <div id="todolist">{renderTodos()}</div>
      </div>
    </div>
  );
}