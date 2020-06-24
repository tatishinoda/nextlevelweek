const express = require("express")
const server = express()


// peger o bd
const db = require("./database/db.js")

//confg pasta publica
server.use(express.static("public"))

//habilitar req.body na app
server.use(express.urlencoded({ extended: true}))

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
	//query strings da URL
	console.log(req.query)
	return res.render("create-point.html")
})

server.post("/savepoint", (req,res)=>{
	
	//req.pody - corpo do formulário
	//console.log(req.body)


	//inserir os dados no BD 
		//inserir na tabela
		const query = `
				INSERT INTO places (
					image,
					name,
					address,
					address2,
					state,
					city,
					items
				) VALUES (?,?,?,?,?,?,?);	`
		const values = [
			req.body.image,
			req.body.name,
			req.body.address,
			req.body.address2,
			req.body.state,
			req.body.city,
			req.body.items
		]

	//depois de enviar os dados, ele exibe o resultado
	function afterInsertData(err){
		if(err){
			return console.log(err)
			return res.send("Erro no Cadastro")
		}
		console.log("Cadastrado com sucesso")
		console.log(this)
		//Retorna somente depois do cadastro
		return res.render("create-point.html", {saved:true})
	}

	db.run(query, values, afterInsertData)
})

server.get("/search", (req,res) => {
	
	const search = req.query.search
	if(search == ""){
		//pesquisa vazia
		//mostrar html com os dados do BD
		return res.render("search-results.html", {total: 0})
	}
	//pegar os dados do BD
	//% indica que aceita qualquer coisa que vier antes ou depois
	db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
				if(err){
					return console.log(err)
				}
				const total = rows.length

				//mostrar html com os dados do BD
				return res.render("search-results.html", {places : rows, total: total})
			})	
})

//ligar o servidor
server.listen(3000)