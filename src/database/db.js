// Configuração do json-server
//
// O json-server roda em uma porta diferente para não conflitar com o servidor Express
// Use este arquivo para fazer requisições ao json-server

const axios = require('axios')

const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001'

const db = {
	// GET - buscar todos os registros de uma tabela
	async getAll(resource) {
		try {
			const response = await axios.get(`${JSON_SERVER_URL}/${resource}`)
			return response.data
		} catch (error) {
			console.error(`Erro ao buscar ${resource}:`, error.message)
			return []
		}
	},

	// GET - buscar um registro por ID
	async getById(resource, id) {
		try {
			const response = await axios.get(`${JSON_SERVER_URL}/${resource}/${id}`)
			return response.data
		} catch (error) {
			console.error(`Erro ao buscar ${resource} com ID ${id}:`, error.message)
			return null
		}
	},

	// POST - criar um novo registro
	async create(resource, data) {
		try {
			const response = await axios.post(`${JSON_SERVER_URL}/${resource}`, data)
			return response.data
		} catch (error) {
			console.error(`Erro ao criar ${resource}:`, error.message)
			throw error
		}
	},

	// PUT - atualizar um registro completo
	async update(resource, id, data) {
		try {
			const response = await axios.put(`${JSON_SERVER_URL}/${resource}/${id}`, data)
			return response.data
		} catch (error) {
			console.error(`Erro ao atualizar ${resource}:`, error.message)
			throw error
		}
	},

	// DELETE - deletar um registro
	async delete(resource, id) {
		try {
			await axios.delete(`${JSON_SERVER_URL}/${resource}/${id}`)
			return true
		} catch (error) {
			console.error(`Erro ao deletar ${resource}:`, error.message)
			throw error
		}
	}
}

module.exports = db
//utilizar o objeto db para operações

// db.serialize( ()=> {
// 	//criar tabela
// 	db.run(`
// 			CREATE TABLE IF NOT EXISTS places (
// 				id INTEGER PRIMARY KEY AUTOINCREMENT,
// 				image TEXT,
// 				name TEXT,
// 				address TEXT,
// 				address2 TEXT,
// 				state TEXT,
// 				city TEXT,
// 				items TEXT
// 			);
// 	`)


// 	//inserir na tabela
// const query = `
// 		INSERT INTO places (
// 			image,
// 			name,
// 			address,
// 			address2,
// 			state,
// 			city,
// 			items
// 		) VALUES (?,?,?,?,?,?,?);	`

// 	const values = [
// 		"https://images.unsplash.com/photo-1555606090-1640be5631c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1225&q=80",
// 		"Papersider",
// 		"Guilherme Gemballa, Jardim América",
// 		"Nº 260",
// 		"Santa Catarina",
// 		"Rio do Sul",
// 		"Resíduos Eletronicos, Lâmpadas"
// 	]

// 	//depois de enviar os dados, ele exibe o resultado
// 	function afterInsertData(err){
// 		if(err){
// 			return console.log(err)
// 		}
// 		console.log("Cadastrado com sucesso")
// 		console.log(this)

// 	}

// 	db.run(query, values, afterInsertData)

// 	//consultar dados na tabela
// 	// db.all(`SELECT * FROM places`, function(err, rows){
// 	// 	if(err){
// 	// 		return console.log(err)
// 	// 	}
// 	// 	console.log("Aqui estão seus registros:")
// 	// 	console.log(rows)
// 	// })

	//deletar dados na tabela
	// db.run(`DELETE FROM places WHERE id = ?`, [1], function(err){
	// 	if(err){
	// 		return console.log(err)
	// 	}
	// 	console.log("Registro deletado com sucesso!")

	// })

// })
