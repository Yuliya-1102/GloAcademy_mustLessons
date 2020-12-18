'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted, container) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.container = document.querySelector(container);
        this.li = ''; 
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList'))); //создаем объект, где будут храниться данные из addTodo
    }
    //объект в массив => конвертируем в json файл => сохраняем в localStorage
    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this); // коллбек не имеет своего this => передали this, либо делаем стрелочную функцию createItem (todo);
        this.addToStorage();
    }

    createItem (todo) { //при переборе this.todoData, на каждый цикл создается li
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);
        //определяем, куда идут дела, в зависимости от выполнения true/false
        if(todo.completed){
            this.todoCompleted.append(li);
        } else{
            this.todoList.append(li);
        }
        this.li = document.querySelectorAll('.todo-item');
    }

    addTodo(e) { //  будут создваться объекты с данными из input и сохраняться в this.todoData 
        e.preventDefault();
        if(this.input.value.trim()){
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo); // создаем объект с ключом и объектом
            this.render(); //перебираем this.todoData
        } else if(this.input.value === ''){
            alert("Введите задачу");
            this.form.removeEventListener('submit', this.addTodo.bind(this));
        }
        this.input.value = '';
    }

    generateKey() { // создаем ключ для newTodo.key в addTodo
        return Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);
    }

    deleteItem(item) {
        this.todoData.forEach((elem) => {
            if(item === elem.key){
                this.todoData.delete(elem.key);
            }
        });
        this.render();
    } 

    completedItem(item) {
        this.todoData.forEach((elem) => {
            if(item === elem.key){
                elem.completed = !elem.completed;
                localStorage.setItem('toDoList', JSON.stringify(this.todoData));
            }
        });
        this.render();
    }

    handler(event) {
        let target = event.target;
        if(target.classList.contains('todo-remove')){
            let keyItem = target.closest('.todo-item').key;
            this.deleteItem(keyItem);
        } else if(target.classList.contains('todo-complete')){
            let keyItem = target.closest('.todo-item').key;
            this.completedItem(keyItem);
        } 
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.container.addEventListener('click', this.handler.bind(this));
        this.render();
    }
}

const todo = new Todo(".todo-control", ".header-input", ".todo-list", ".todo-completed", ".todo-container");

todo.init();