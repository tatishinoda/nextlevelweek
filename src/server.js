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

	try {
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
				console.error("Erro ao inserir:", err)
				return res.status(500).send("Erro no Cadastro: " + err.message)
			}
			console.log("Cadastrado com sucesso")
			//Retorna somente depois do cadastro
			return res.render("create-point.html", {saved:true})
		}

		db.run(query, values, afterInsertData)
	} catch (error) {
		console.error("Erro em /savepoint:", error)
		res.status(500).send("Erro no servidor")
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
		db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
					if(err){
						console.error("Erro ao buscar:", err)
						return res.status(500).send("Erro ao buscar: " + err.message)
					}

					if (!rows) {
						return res.render("search-results.html", {total: 0})
					}

					const total = rows.length
					//mostrar html com os dados do BD
					return res.render("search-results.html", {places : rows, total: total})
				})
	} catch (error) {
		console.error("Erro em /search:", error)
		res.status(500).send("Erro no servidor")
	}
})

//ligar o servidor
const PORT = process.env.PORT || 3000

// Garantir que a tabela existe antes de ouvir requisições
db.serialize(() => {
	db.run(`
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
	`, (err) => {
		if (err) {
			console.error("Erro ao criar tabela:", err)
			process.exit(1) // Sair se não conseguir criar a tabela
		} else {
			console.log("Tabela places criada/verificada com sucesso")

			// Só iniciar o servidor após a tabela estar pronta
			server.listen(PORT, () => {
				console.log(`Servidor rodando na porta ${PORT}`)
			})
		}
	})
})

// Tratamento global de erros não capturados
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error)
	// Log mas não saia para evitar que o processo crash complete
})

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

module.exports = server
