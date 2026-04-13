const express = require("express")
const path = require("path")
const server = express()


// peger o bd
const db = require("./database/db.js")

//confg pasta publica
server.use(express.static(path.join(__dirname, "../public")))

//habilitar req.body na app
server.use(express.urlencoded({ extended: true}))

//Template engine
const nunjucks = require("nunjucks")
nunjucks.configure(path.join(__dirname, "views"), {
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

	try {
		//inserir os dados no BD
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

		const stmt = db.prepare(query)
		stmt.run(
			req.body.image,
			req.body.name,
			req.body.address,
			req.body.address2,
			req.body.state,
			req.body.city,
			req.body.items
		)

		console.log("Cadastrado com sucesso")
		return res.render("create-point.html", {saved:true})
	} catch (error) {
		console.error("Erro em /savepoint:", error)
		res.status(500).send("Erro no Cadastro: " + error.message)
	}
})

server.get("/search", (req,res) => {

	try {
		const search = req.query.search
		if(search == ""){
			//pesquisa vazia
			//mostrar html com os dados do BD
			return res.render("search-results.html", {total: 0})
		}

		//pegar os dados do BD
		//% indica que aceita qualquer coisa que vier antes ou depois
		const query = `SELECT * FROM places WHERE city LIKE ?`
		const stmt = db.prepare(query)
		const rows = stmt.all(`%${search}%`)

		if (!rows || rows.length === 0) {
			return res.render("search-results.html", {total: 0})
		}

		const total = rows.length
		//mostrar html com os dados do BD
		return res.render("search-results.html", {places : rows, total: total})
	} catch (error) {
		console.error("Erro em /search:", error)
		res.status(500).send("Erro ao buscar: " + error.message)
	}
})

// Garantir que a tabela existe
try {
	db.exec(`
		CREATE TABLE IF NOT EXISTS places (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			image TEXT,
			name TEXT,
			address TEXT,
			address2 TEXT,
			state TEXT,
			city TEXT,
			items TEXT
		);
	`)
	console.log("Tabela places criada/verificada com sucesso")
} catch (err) {
	console.error("Erro ao criar tabela:", err)
}

// Tratamento global de erros não capturados
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Exportar para Vercel (serverless)
module.exports = server

// Se é ambiente local, escutar em porta
if (process.env.NODE_ENV !== 'production') {
	const PORT = process.env.PORT || 3000
	server.listen(PORT, () => {
		console.log(`Servidor rodando na porta ${PORT}`)
	})
}
