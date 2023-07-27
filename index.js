const express = require("express")
const server = express();

server.use(express.json());

// Query params = ?nome=NodeJS
// Route params = /curso/2
// Request body = { nome: "Nodejs", tipo: "Backend" }

// CRUD => Create, Read, Update, Delete

const cursos = ["Node JS", "JavaScript", "React Native"]

// Middleware Global
server.use((req, res, next) => {
    console.log(`URL chamada: ${req.url}`);

    return next();
})

// Middleware 
function checkCurso(req, res, next) {
    if(!req.body.name) {
        return res.status(400).json({ error: "Nome do curso inválido" })
    }

    return next();
}

// Middleware
function checkIndexCurso(req, res, next) {
    const curso = cursos[req.params.index];
    if(!curso) {
        return res.status(400).json({ error: "O curso não existe" })
    }

    req.curso = curso;

    return next();
}

// Listando todos os cursos
server.get("/cursos", (req, res) => {
    return res.json(cursos)
})

// Listagem de um curso
server.get("/cursos/:index", checkIndexCurso, (req, res) => {
    
    // cursos[index] === req.curso
    return res.json(req.curso)

})

// Criando um novo curso
server.post("/cursos", checkCurso, (req, res) => {
    const { name } = req.body
    cursos.push(name)

    return res.json(cursos)
})

// Atualizando um curso
server.put("/cursos/:index", checkCurso, checkIndexCurso, (req, res) => {
    const { index } = req.params
    const { name } = req.body

    cursos[index] = name

    return res.json(cursos)
})

// Deletar um curso
server.delete("/cursos/:index", checkIndexCurso, (req, res) => {
    const { index } = req.params

    // Deleta 1 elemento no índice passado 
    cursos.splice(index, 1)

    return res.json({ message: "Curso deletado com sucesso" })
})

server.listen(3000);