const express = require("express")
const path = require("path")
const server = express()

// pegar o db (agora usando json-server)
const db = require("./database/db.js")

// Inicializar banco com dados
const seedDatabase = require("./database/seed.js")
seedDatabase()

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

server.post("/savepoint", async (req,res)=>{
	//req.body - corpo do formulário
	//console.log(req.body)

	try {
		// criar novo ponto de coleta
		const newPlace = {
			image: req.body.image,
			name: req.body.name,
			address: req.body.address,
			address2: req.body.address2,
			state: req.body.state,
			city: req.body.city,
			items: req.body.items
		}

		//inserir os dados no banco usando json-server
		await db.create('places', newPlace)

		console.log("Cadastrado com sucesso")
		return res.render("create-point.html", {saved:true})
	} catch (error) {
		console.error("Erro em /savepoint:", error)
		res.status(500).send("Erro no Cadastro: " + error.message)
	}
})

//função para normalizar string (remover acentos, converter para minúsculas)
function normalizarString(str) {
	if (!str) return ''
	return str
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
}

server.get("/search", async (req,res) => {
	try {
		const search = req.query.search
		console.log("Busca recebida:", search)

		if(search == ""){
			//pesquisa vazia
			//mostrar html com os dados do BD
			return res.render("search-results.html", {total: 0})
		}

		//pegar todos os dados do BD
		const allRows = await db.getAll('places')

		console.log("Total de registros no BD:", allRows.length)
		console.log("Registros:", allRows)

		//normalizar o termo de busca
		const searchNormalizado = normalizarString(search)
		console.log("Busca normalizada:", searchNormalizado)

		//filtrar resultados que combinam com a busca normalizada
		const rows = allRows.filter(place => {
			const cityNormalizada = normalizarString(place.city)
			const match = cityNormalizada.includes(searchNormalizado)
			console.log(`Comparando "${place.city}" (${cityNormalizada}) com "${searchNormalizado}": ${match}`)
			return match
		})

		console.log("Resultados encontrados:", rows.length)

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

// Tratamento global de erros não capturados
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Exportar servidor
module.exports = server
