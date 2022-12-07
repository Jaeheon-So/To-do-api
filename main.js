const inputTask = document.getElementById("input-task");
const btnAdd = document.getElementById("btn-add");
const tabs = document.querySelectorAll(".task-status div");
const tabAll = document.getElementById("tab-all");
const tabDone = document.getElementById("tab-done");
const tabNotDone = document.getElementById("tab-not-done");
const underline = document.getElementById("underline");
const btnModify = document.querySelector(".btn-modify");
const btnCancel = document.querySelector(".btn-cancel");
const modal = document.getElementById("modal");
const modalContent = document.querySelector(".content input");
const btnDeleteAllDone = document.querySelector(".delete-all-done");

let taskList = [];
let notDoneList = [];
let doneList = [];
let mode = "all";
let taskId;
let taskStatus;

btnAdd.addEventListener("click", addTask);

inputTask.addEventListener("keyup", function (e) {
  if (e.key === "Enter") addTask();
});

for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

tabAll.addEventListener("click", allRender);
tabNotDone.addEventListener("click", notDoneRender);
tabDone.addEventListener("click", doneRender);

btnDeleteAllDone.addEventListener("click", async () => {
  for (let task of doneList) {
    const res = await fetch(
      `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${task.id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          apikey: "FcKdtJs202209",
          username: "KDT3_SoJaeHeon",
        },
      }
    );
  }
  taskList = await getToDo();
  if (mode === "done") {
    doneRender();
  } else if (mode === "not done") {
    notDoneRender();
  } else {
    allRender();
  }
});

btnModify.addEventListener("click", async () => {
  console.log(taskId);
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${taskId}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_SoJaeHeon",
      },
      body: JSON.stringify({
        title: modalContent.value,
        done: taskStatus,
      }),
    }
  );
  const data = await res.json();
  taskList = await getToDo();
  if (mode === "done") {
    doneRender();
  } else if (mode === "not done") {
    notDoneRender();
  } else {
    allRender();
  }
  modal.style.display = "none";
});

btnCancel.addEventListener("click", () => {
  modal.style.display = "none";
});

async function addTask() {
  if (inputTask.value == "") {
    alert("내용을 입력하주세요.");
    return;
  }
  await createTodo();
  taskList = await getToDo();
  if (mode === "done") {
    doneRender();
  } else if (mode === "not done") {
    notDoneRender();
  } else {
    allRender();
  }
  inputTask.value = "";
}

async function createTodo() {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_SoJaeHeon",
      },
      body: JSON.stringify({
        title: inputTask.value,
      }),
    }
  );
  const data = await res.json();
  return data;
}

async function getToDo() {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_SoJaeHeon",
      },
    }
  );
  const data = await res.json();
  return data;
}

async function init() {
  taskList = await getToDo();
  render(taskList);
}
init();

function render(list) {
  let result = ``;
  for (let i = 0; i < list.length; i++) {
    if (list[i].done) {
      result += `<div class="task task-done">
                    <div class="title task-complete" onclick="taskChange('${list[i].id}')">
                      ${list[i].title}
                    </div>
                    <div class="btn-box">
                        <button onclick="taskComplete('${list[i].id}')"><i class="fas fa-undo-alt"></i></button>
                        <button onclick="taskDelete('${list[i].id}')"><i class="fa fa-trash"></i></button>
                    </div>
                </div>`;
    } else {
      result += `<div class="task">
                    <div class="title" onclick="taskChange('${list[i].id}')">${list[i].title}</div>
                    <div class="btn-box">
                        <button onclick="taskComplete('${list[i].id}')"><i class="fa fa-check"></i></button>
                        <button onclick="taskDelete('${list[i].id}')"><i class="fa fa-trash"></i></button>
                    </div>
                </div>`;
    }
  }
  document.getElementById("task-board").innerHTML = result;
}

function allRender() {
  btnDeleteAllDone.style.display = "none";
  mode = "all";
  render(taskList);
}

function notDoneRender() {
  btnDeleteAllDone.style.display = "none";
  mode = "not done";
  notDoneList = [];
  for (let i = 0; i < taskList.length; i++) {
    if (!taskList[i].done) {
      notDoneList.push(taskList[i]);
    }
  }
  render(notDoneList);
}

function doneRender() {
  btnDeleteAllDone.style.display = "block";
  mode = "done";
  doneList = [];
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].done) {
      doneList.push(taskList[i]);
    }
  }
  render(doneList);
}

function taskChange(id) {
  taskId = id;
  for (let i = 0; i < taskList.length; i++) {
    if (id === taskList[i].id) {
      modalContent.value = taskList[i].title;
      taskStatus = taskList[i].done;
      break;
    }
  }
  modal.style.display = "block";
}

async function taskComplete(id) {
  let title;
  let doneStatus;
  for (let i = 0; i < taskList.length; i++) {
    if (id === taskList[i].id) {
      title = taskList[i].title;
      doneStatus = !taskList[i].done;
      break;
    }
  }
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${id}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_SoJaeHeon",
      },
      body: JSON.stringify({
        title: title,
        done: doneStatus,
      }),
    }
  );
  // const data = await res.json();
  // console.log(data);
  taskList = await getToDo();
  if (mode == "done") {
    doneRender();
  } else if (mode == "not done") {
    notDoneRender();
  } else {
    allRender();
  }
}

async function taskDelete(id) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${id}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_SoJaeHeon",
      },
    }
  );
  taskList = await getToDo();
  if (mode == "done") {
    doneRender();
  } else if (mode == "not done") {
    notDoneRender();
  } else {
    allRender();
  }
}

function filter(e) {
  if (e) {
    underline.style.width = e.target.offsetWidth + "px";
    underline.style.left = e.target.offsetLeft + "px";
    underline.style.top =
      e.target.offsetTop + (e.target.offsetHeight - 4) + "px";
  }
}
