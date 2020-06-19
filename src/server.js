const express = require("express")
const server = express()


//confg pasta publica
server.use(express.static("public"))


//Template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
	express: server,
	noCache: true
})

//config caminho da aplicação

//pagina inicial
//req - requisição
//res - resposta
server.get("/", (req,res) => {
	return res.render("index.html", {
		title: "Seu marketplace"
	})
})
server.get("/create-point", (req,res) => {
	return res.render("create-point.html")
})
server.get("/search", (req,res) => {
	return res.render("search-results.html")
})

//ligar o servidor
server.listen(3000)