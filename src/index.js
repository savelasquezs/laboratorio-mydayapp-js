
import "./css/base.css";

import { sayHello } from "./js/utils";

const toDoList=document.querySelector(".todo-list")
const todoNode=document.querySelector(".new-todo")
const countSpan=document.querySelector(".todo-count")
const clearCompleted=document.querySelector(".clear-completed")
const main=document.querySelector(".main")
const footer=document.querySelector(".footer")





const count=()=>{
  const pending=localStorage.getItem("mydayapp-js")
  ?JSON.parse(localStorage.getItem("mydayapp-js")).filter(todo=>!todo.completed).length
  :0
  const items=pending!=1?"items":"item"
  const itemsCount=`<strong>${pending}</strong> ${items} left`
  countSpan.innerHTML=itemsCount
}


const complete=(id)=>{
  const checked=document.getElementById(id)
  checked.addEventListener("click",()=>{
    const listItem=checked.parentNode.parentNode
    if (checked.checked){
      listItem.classList.add("completed")
      listItem.classList.remove("pending")
    }
    else{
      listItem.classList.remove("completed")
      listItem.classList.add("pending")
    }
    let todos=JSON.parse(localStorage.getItem("mydayapp-js"))
    const completedItem=todos.find(todo=>todo.id==id)
    completedItem.completed=listItem.classList.value=="completed"?true:false
    todos=JSON.stringify(todos)
    localStorage.setItem("mydayapp-js",todos)
    count()
  
  })

}

todoNode.addEventListener("keypress", (event)=>{
  if (event.key=="Enter"){
    let todos=[]
    
    if (localStorage.getItem("mydayapp-js")){
      todos=JSON.parse(localStorage.getItem("mydayapp-js"))
    }
    const todo=todoNode.value.trim()
    if (todo.length>0){
      let nodo={id:todo,title:todo, completed:false}
      todos.push(nodo)
      todos=JSON.stringify(todos)
      localStorage.setItem("mydayapp-js",todos)
      todoNode.value=""
      showAll()
    }
  }
})

const show=(todos)=>{
  const listed=todos.map(todo=>{
    let status="pending"
    if (todo.completed){
      status="completed"
    }

    return `
    <li class="${status}" >
      <div class="view">
        <input class="toggle" type="checkbox" id="${todo.id}" />
        <label>${todo.title}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="${todo.title}" />
    </li>
    `
  }).join("")
  toDoList.innerHTML=listed
  todos.forEach(todo=>{
    const toggle=document.getElementById(`${todo.id}`)
    const parentNode=toggle.parentNode.parentNode
    const label=toggle.nextElementSibling
    label.addEventListener("dblclick",()=>{

      parentNode.classList.remove("completed")
      parentNode.classList.remove("pending")
      parentNode.classList.add("editing")
      const parentString=parentNode.innerHTML
      toDoList.innerHTML=parentString
      const edit=document.querySelector(".edit")
      const previewsValue=edit.value
      todos=JSON.parse(localStorage.getItem('mydayapp-js'))
      const mytodo=todos.find(todo=>todo.id==previewsValue)
      const prevstatus=mytodo.completed
      console.log(prevstatus);
      edit.addEventListener("keydown",(event)=>{
        if(event.key=="Enter"){
          mytodo.id=edit.value
          mytodo.title=edit.value
          mytodo.completed=prevstatus
          todos=JSON.stringify(todos)
          localStorage.setItem("mydayapp-js",todos)
          showAll()
        }
        else if(event.key=="Escape"){
          showAll()
        }
      })
      
    })      
    // const edit=document.querySelector(``)
    if (todo.completed){
      toggle.setAttribute("checked","true")
    }
  })
  count()
  todos.map(todo=>{
    complete(todo.id)
  })


}



const showAll=()=>{
  main.style.display="none"
  footer.style.display="none"
  if (localStorage.getItem("mydayapp-js")){
    const todos=JSON.parse(localStorage.getItem("mydayapp-js"))
    show(todos)
    if (todos.length>0){
      main.style.display="block"
      footer.style.display="block"
    }
  }

}

const filterCompleted=()=>{
  const locationStr=window.location.toString()
  const todos=JSON.parse(localStorage.getItem("mydayapp-js"))
  if (locationStr.includes("completed")){
    const completedTodos=todos.filter(todo=>todo.completed)
    show(completedTodos)

  }
  else if (locationStr.includes("pending")){
    const pendingTodos=todos.filter(todo=>!todo.completed)
    console.log(pendingTodos);
    show(pendingTodos)
  }
  else{
    showAll()
  }

}
window.addEventListener("load",()=>{
 window.location="http://localhost:3000/#"
 showAll()
})
window.addEventListener("hashchange",filterCompleted)

const deleteCompleted=()=>{
  let todos=JSON.parse(localStorage.getItem("mydayapp-js"))
  todos=todos.filter(todo=>!todo.completed)
  todos=JSON.stringify(todos)
  localStorage.setItem("mydayapp-js",todos)
  window.location="http://localhost:3000/#"
  showAll()

}

clearCompleted.addEventListener("click",deleteCompleted)


