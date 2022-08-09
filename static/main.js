const d = document,
  $form = d.getElementById("tasksForm");

let myTasks = [],
  editing = false,
  taskId = null;

// Load data
d.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/tasks"),
    data = await response.json();
  myTasks = data;
  renderTask(myTasks);
});

// Create - Update
$form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const typetask = $form["typetask"].value.toLowerCase(),
    title = $form["title"].value,
    description = $form["description"].value;

  if (typetask === "work" || typetask === "leisure" || typetask === "study") {
    if (!editing) {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          typetask,
          title,
          description,
        }),
      });

      // Transform the response to JSON so that it is read in the app
      const data = await response.json();
      myTasks.push(data);
    } else {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          typetask,
          title,
          description,
        }),
      });
      // data es mi dato actualizado
      const udateTask = await response.json();
      myTasks = myTasks.map((task) =>
        task.id === udateTask.id ? udateTask : task
      );
      editing = false;
      taskId = null;
    }
    renderTask(myTasks);
    $form.reset();
  } else {
    alert(
      "😜Please enter a valid type of task, Only tasks from work, study or leisure😜"
    );
    if (!editing) $form.reset();
  }
});

// Read
function renderTask(myTasks) {
  const $tbody = d.querySelector("tbody");
  $tbody.innerHTML = "";

  myTasks.forEach((task) => {
    const paintData = d.createElement("tr");
    paintData.innerHTML = `<td>${
      task.id
    }</td><td>${task.typetask.toUpperCase()}</td><td>${
      task.title
    }</td><td><p class"text-truncate text-danger">${
      task.description
    }</p></td><td><button class="btn-edit btn btn-primary rounded-circle"><i class="fa-solid fa-pen-to-square"></i></button>
    <button class="btn-delete btn btn-danger rounded-circle"><i class="fa-solid fa-trash-arrow-up rounded-circle"></i></button></td>`;
    const btnDelete = paintData.querySelector(".btn-delete");

    btnDelete.addEventListener("click", async () => {
      if (confirm("Do you want to delete this task?🤔")) {
        const response = await fetch(`/api/tasks/${task.id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        myTasks = myTasks.filter((task) => task.id !== data.id);
        renderTask(myTasks);
      }
    });

    const btnEdit = paintData.querySelector(".btn-edit");

    btnEdit.addEventListener("click", async (e) => {
      const response = await fetch(`/api/tasks/${task.id}`);
      const data = await response.json();

      typetask = $form["typetask"].value = data.typetask;
      title = $form["title"].value = data.title;
      description = $form["description"].value = data.description;

      editing = true;
      taskId = data.id;
    });

    $tbody.appendChild(paintData);
  });
}
