let tasksDiv = document.querySelector(".tasks-div");
let input = document.querySelector(".task");
let createBtn = document.querySelector(".create");
let arrayOfTasks = [];

if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.tasks);
} else {
  arrayOfTasks = [];
}

getData();

function create() {
  if (input.value !== "") {
    addTask(input.value);
    input.value = "";
  }
}

createBtn.onclick = () => {
  create();
  swal.fire({
    title: "item added",
    icon: "success",
  });
};

function addTask(taskText) {
  let date = new Date().toString().split(" ");
  nowDate =
    date[4].slice(0, 5) + " , " + date[1] + " , " + date[2] + " , " + date[3];
  const task = {
    id: Date.now(),
    date: nowDate,
    title: taskText,
  };
  arrayOfTasks.push(task);
  tasksToPage(arrayOfTasks);
  tasksToStorage(arrayOfTasks);
}

function tasksToPage(arrayOfTasks) {
  tasksDiv.innerHTML = "";
  arrayOfTasks.forEach((task) => {
    let div = document.createElement("div");
    div.classList.add("div");
    div.setAttribute("data-id", task.id);

    let taskDate = document.createElement("p");
    taskDate.innerHTML = task.date;
    taskDate.classList.add("date");
    let title = document.createElement("div");
    title.classList.add("title");
    title.innerHTML = `<h1>${task.title}</h1> <p>${task.date}</p>`;

    let delBtn = document.createElement("i");
    delBtn.className = "fa-regular fa-trash-can del";
    delBtn.classList.add("del");
    delBtn.onclick = (e) => {
      askForDelete(e.target.parentElement.getAttribute("data-id"));
      console.log("del");
    };
    div.appendChild(title);
    div.appendChild(delBtn);

    tasksDiv.appendChild(div);
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
              title: "all items deleted successfully",
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
  Swal.fire({
    title: "are you sure ?",
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "No, don't delete",
    confirmButtonText: "Yes, delete it",
  }).then((res) => {
    if (res.isConfirmed) {
      del(id);
      Swal.fire({
        title: "item deleted successfully",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "action cancelled",
        icon: "error",
      });
    }
  });
}
