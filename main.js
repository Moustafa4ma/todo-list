let tasksDiv = document.querySelector(".tasks-div");
let input = document.querySelector(".input");
let createBtn = document.getElementById("create");
let updateBtn = document.getElementById("update");
let arrayOfTasks = [];
let form = document.querySelector(".form");
let cancelEdit = document.getElementById("cancelEdit");

if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.tasks);
} else {
  arrayOfTasks = [];
}

getData();

function create() {
  if (input.value !== "") {
    swal.fire({
      title: "task added",
      icon: "success",
    });
    addTask(input.value);
    input.value = "";
  }
}

createBtn.onclick = () => {
  create();
};

function addTask(taskText) {
  let date = new Date().toString().split(" ");
  nowDate =
    date[4].slice(0, 5) + " , " + date[1] + " , " + date[2] + " , " + date[3];
  const task = {
    id: Date.now(),
    date: nowDate,
    title: taskText,
    completed: 0,
  };
  arrayOfTasks.push(task);
  tasksToPage(arrayOfTasks);
  tasksToStorage(arrayOfTasks);
}

function tasksToPage(arrayOfTasks) {
  tasksDiv.innerHTML = "";
  arrayOfTasks.forEach((task) => {
    let taskContainer = document.createElement("div");
    taskContainer.classList.add("taskContainer");
    let div = document.createElement("div");
    div.classList.add("div");
    taskContainer.setAttribute("data-id", task.id);

    let taskDate = document.createElement("p");
    taskDate.innerHTML = task.date;
    taskDate.classList.add("date");
    let title = document.createElement("div");
    title.classList.add("title");
    title.innerHTML = `<h1>${task.title}</h1> <p>${task.date}</p>`;
    let done = document.createElement("button");
    done.className = "fa-solid fa-check done";
    done.addEventListener("click", () => {
      if (task.completed == 0) {
        task.completed = 1;
      } else {
        task.completed = 0;
      }
      tasksToPage(arrayOfTasks);
      tasksToStorage(arrayOfTasks);
    });
    let editBtn = document.createElement("button");
    editBtn.innerHTML = "edit";
    editBtn.classList.add("editBtn");

    editBtn.onclick = () => {
      edit(task, taskContainer);
      updateBtn.onclick = () => {
        if (input.value != "") {
          update(task);
        }
      };
    };

    let delBtn = document.createElement("button");
    delBtn.className = "del";
    delBtn.innerHTML = "delete";
    delBtn.onclick = (e) => {
      askForDelete(e.target.parentElement.getAttribute("data-id"));
    };
    div.appendChild(title);
    div.appendChild(done);

    taskContainer.appendChild(div);
    taskContainer.appendChild(editBtn);
    taskContainer.appendChild(delBtn);

    tasksDiv.appendChild(taskContainer);
    if (task.completed == 1) {
      taskContainer.style.opacity = "0.4";
      done.style.background = "#09e02d";
      title.style.textDecoration = "line-through";
    }
  });
  if (arrayOfTasks.length > 0) {
    let delAll = document.createElement("button");
    delAll.innerHTML = "delete all";
    delAll.className = "delAll";
    delAll.onclick = () => {
      swal
        .fire({
          title: "are you sure ?",
          icon: "question",
          confirmButtonText: "yes delete all items",
          showCancelButton: true,
        })
        .then((res) => {
          if (res.isConfirmed) {
            arrayOfTasks.length = 0;
            tasksToPage(arrayOfTasks);
            tasksToStorage(arrayOfTasks);
            swal.fire({
              title: "all tasks deleted successfully",
              icon: "success",
            });
          } else {
            swal.fire({
              title: "action cancelled",
              icon: "error",
            });
          }
        });
    };
    tasksDiv.appendChild(delAll);
  }
}

function tasksToStorage(arrayOfTasks) {
  localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function getData() {
  if (localStorage.tasks) {
    tasksToPage(JSON.parse(localStorage.tasks));
  }
}

function del(id) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != id);
  tasksToStorage(arrayOfTasks);
  tasksToPage(arrayOfTasks);
}

function askForDelete(id) {
  swal
    .fire({
      title: "are you sure ?",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "No, don't delete",
      confirmButtonText: "Yes, delete it",
    })
    .then((res) => {
      if (res.isConfirmed) {
        del(id);
        swal.fire({
          title: "task deleted successfully",
          icon: "success",
        });
      } else {
        swal.fire({
          title: "action cancelled",
          icon: "error",
        });
      }
    });
}

function edit(task, taskContainer) {
  input.value = task.title;
  createBtn.style.display = "none";
  updateBtn.style.display = "flex";
  cancelEdit.style.display = "block";
  taskContainer.style.opacity = "0.5";
  cancelEdit.onclick = () => {
    cancelEdit.style.display = "none";
    input.value = "";
    updateBtn.style.display = "none";
    createBtn.style.display = "block";
    taskContainer.style.opacity = "1";
  };
}

function update(task) {
  swal.fire({
    title: "task updated",
    icon: "success",
  });
  task.title = input.value;
  tasksToPage(arrayOfTasks);
  tasksToStorage(arrayOfTasks);
  cancelEdit.click();
}
