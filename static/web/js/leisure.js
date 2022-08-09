const $row = document.querySelector(".row"),
  $template = document.getElementById("template").content,
  $fragment = document.createDocumentFragment();

let myTasks = [];

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/tasks"),
    data = await response.json();
  myTasks = data;
  leisureTask(myTasks);
});

function leisureTask(myTasks) {
  const leisure = myTasks.filter((task) => task.typetask === "leisure");
  leisure.forEach((task) => {
    $template.querySelector("h5").textContent = task.title;
    $template.querySelector(".parraf").textContent = task.description;

    let $clone = document.importNode($template, true);
    $fragment.appendChild($clone);
  });
  $row.appendChild($fragment);
}
