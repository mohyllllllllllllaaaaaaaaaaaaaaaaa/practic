import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';
const refs ={
    input: document.querySelector(".input-js"),
    button: document.querySelector(".btn-add"),
    list: document.querySelector(".todo-list")
}
const task = JSON.parse(localStorage.getItem("task")) || [];
export const buttonUpdate =
  '<button type="button" class="btn-update" ></button>';
export const buttonDelete =
  '<button type="button" class="btn-delete" >del</button>';

function createObject(){
    return {
        id:Date.now(),status:'todo',text: refs.input.value.trim(),
    };
}
function updateLocalStorage(todo){

    task.push(todo)
    localStorage.setItem("task", JSON.stringify(task));
}
function createMarkup(todo){
const curentButton = todo.status === "todo" ? buttonUpdate: buttonDelete;
return `<li id="${todo.id}" class="${todo.status}"
><p>${todo.text}</p>${curentButton}</li>`
}
function addTodo(){
    const newTodo = createObject();
    const markup = createMarkup(newTodo);
    refs.list.insertAdjacentHTML("beforeend", markup);
    updateLocalStorage(newTodo);
    refs.input.value = "";
}
refs.button.addEventListener('click', addTodo );
const storageData = JSON.parse(localStorage.getItem("task"));
function reloadPage(){
    if(!storageData || !storageData.length) return;
    const markup = storageData.map(createMarkup).join("");
    refs.list.innerHTML = markup;
}
if(storageData !== null){
    reloadPage()
}
function togolStatus(event){
    if(event.target.nodeName !== "LI" ){
        return;
    }

    if(event.target.classList.contains("todo")){
event.target.classList.replace("todo","complete");
event.target.lastElementChild.remove();
event.target.insertAdjacentHTML("beforeend", buttonDelete);
}else {
    event.target.classList.replace("complete","todo");
    event.target.lastElementChild.remove();
event.target.insertAdjacentHTML("beforeend", buttonUpdate);
}
updateStatusStorage(event.target);
}
refs.list.addEventListener('click',togolStatus);
function updateStatusStorage(el){
  const data = JSON.parse(localStorage.getItem("task"));
  const upData = data.map(todo => {
    if(todo.id === +el.id ){
        todo.status = el.classList[0];
    }
    return todo;
  });
  localStorage.setItem("task", JSON.stringify(upData)); 
}
function removeTodo(event){
   if(!event.target.classList.contains("btn-delete")){
        return;
    }
    event.target.parentNode.remove();
    removeLocalStorage(event.target.parentNode)
}
refs.list.addEventListener('click', removeTodo);
function removeLocalStorage(el){
    const data = JSON.parse(localStorage.getItem("task"));
    const filteredData = data.filter(todo => todo.id !== +el.id)
    localStorage.setItem("task", JSON.stringify(filteredData));
}
function editTodo(event){
    if(!event.target.classList.contains("btn-update")) {
        return;
    }
    const taskElements = event.target.closest("LI");
    const taskId = +taskElements.id;
    const taskText = taskElements.querySelector("P").textContent;
    const modal = basicLightbox.create(`   <div class="modal">
            <input type="text" id="edit-input" value="${taskText}" />
            <button id="update-task">Оновити</button>
            <button id="close-modal">Закрити</button>
        </div>`);
        modal.show();

        const modalElement = modal.element();
       modalElement.document.querySelector("#update-task").addEventListener('click', () => {
            const newText = document.querySelector("#edit-input").value.trim();
            if(newText){
                taskElements.querySelector("P").texContent = newText;
                updateLocalStorageAfterEdit(taskId, newText);
            }
            modal.close();
        });
        modalElement.document.querySelector("#close-modal").addEventListener('click', () => modal.close());
        function updateLocalStorageAfterEdit(id, newText){
            const data = JSON.parse(localStorage.getItem("task")) || [];
            const updateData = data.map(todo => {
                if (todo.id === id){
                    todo.text = newText;
                }
                return todo;
            });
            localStorage.setItem("task", JSON.stringify(updateData));
        }
}
refs.list.addEventListener('click', editTodo);