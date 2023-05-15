const fs = require("fs");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dayjs = require('dayjs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// on créé le fichier JSON s'il n'existe pas
const jsonPath = "todos.json";

function loadTodos() {
    if (!fs.existsSync(jsonPath)) fs.writeFileSync(jsonPath, "[]", "utf8");
    let todosObj = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    if (!Array.isArray(todosObj)) todosObj = []; // ici petite sécurité pour éviter les erreurs si le fichier JSON est corrompu (si ce n'est pas un tableau)
    return todosObj;
}
function saveTodos() {
    fs.writeFileSync(jsonPath, JSON.stringify(todos), "utf8");
}
function getNextId() {
    return todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
}


let todos = loadTodos();

// on redirige l'url / vers la liste des todos
app.get("/", function (req, res) {
    let html = fs.readFileSync("views/index.html", "utf8");
    res.send(html);
});

// retourne la liste des todos
app.get("/todos", function (req, res) {
    res.send(todos);
});
// retourne la todo dont l'id est passé en paramètre
app.get("/todo/:id", function (req, res) {
});
// ajoute une todo
app.post("/todo", function (req, res) {

    console.log("🚀 ~ file: index.js:45 ~ req.body:", req.body)
    if (req.body.tache) {
        let objet = {
            id: getNextId(),
            tache: req.body.tache,
            date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            color: req.body.color,
            done: false,
        }
        todos.push(objet);
    }

    fs.writeFileSync("todos.json", JSON.stringify(todos), "utf8");
    res.send({ success: true });

});
// modifie une todo
app.put("/todo/:id", function (req, res) {
    console.log(req.body)

    todos.find(todo => todo.id == req.params.id).done = req.body.done
    saveTodos();
    res.send({ success: true });
});
// supprime toutes les todos dont le champ done est à true
app.delete("/todos", function (req, res) {

    // if (req.params.id) {
    //     for (let i = 0; i < todos.length; i++) {
    //         if (todos[i].id == req.params.id) {
    //             todos[i].done = req.body.done
    //         }
    //     }
    // }
    todos = todos.filter(todo => todo.done == false);
    res.send({ success: true });
    saveTodos();
});

app.listen(8000, function () {
    console.log("listening on port 8000");
});