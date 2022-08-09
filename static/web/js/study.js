const $row = document.querySelector(".row"),
  $template = document.getElementById("template").content,
  $fragment = document.createDocumentFragment();

let myTasks = [];

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/tasks"),
    data = await response.json();
  myTasks = data;
  studyTask(myTasks);
});

function studyTask(myTasks) {
  const work = myTasks.filter((task) => task.typetask === "study");
  work.forEach((task) => {
    $template.querySelector("h5").textContent = task.title;
    $template.querySelector(".parraf").textContent = task.description;

    let $clone = document.importNode($template, true);
    $fragment.appendChild($clone);
  });
  $row.appendChild($fragment);
}
