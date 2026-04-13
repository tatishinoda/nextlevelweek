const db = require('./db.js')

const PLACES = [
	{
		image: 'https://images.unsplash.com/photo-1555606090-1640be5631c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1225&q=80',
		name: 'Papersider',
		address: 'Guilherme Gemballa, Jardim América',
		address2: 'Nº 260',
		state: 'Santa Catarina',
		city: 'Rio do Sul',
		items: 'Resíduos Eletronicos, Lâmpadas'
	},
	{
		image: 'https://images.unsplash.com/photo-1567393528677-d6adae7d4a0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		name: 'Colectoria',
		address: 'rua 123',
		address2: 'numer0 30',
		state: 'Espírito Santo',
		city: 'Cariacica',
		items: 'Papéis e Papelão,Resíduos Orgânicos'
	},
	{
		image: 'https://images.unsplash.com/photo-1567393528677-d6adae7d4a0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		name: 'Nome1',
		address: 'rua aaaa',
		address2: '1234',
		state: 'Roraima',
		city: 'Bonfim',
		items: 'Lâmpadas'
	},
	{
		image: 'https://images.unsplash.com/photo-1567393528677-d6adae7d4a0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		name: 'Tati',
		address: 'rua blah',
		address2: '124',
		state: 'Rio de Janeiro',
		city: 'Aperibé',
		items: 'Lâmpadas,Resíduos Eletronicos'
	},
	{
		image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX06S-7Qsp8SkR4OEp8Bkj9uR_Y0vLR9xHlSAgpCpbOuvx0ftZ4z9TxjQiutiZ0nY8uLGlyx6G-Z4xGLXRo7JWuM6xwfyW-v1dz7GmsOQuMng&s=10',
		name: 'Teste',
		address: 'rua 1234',
		address2: '21',
		state: 'São Paulo',
		city: 'São Paulo',
		items: 'Pilhas e Baterias,Lâmpadas'
	}
]

function seedDatabase() {
	try {
		// Criar tabela
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

		// Verificar se já há dados
		const count = db.prepare('SELECT COUNT(*) as count FROM places').get()

		if (count.count === 0) {
			console.log('Inicializando banco com dados...')

			const query = `
				INSERT INTO places (
					image,
					name,
					address,
					address2,
					state,
					city,
					items
				) VALUES (?,?,?,?,?,?,?);
			`

			const stmt = db.prepare(query)

			for (const place of PLACES) {
				stmt.run(
					place.image,
					place.name,
					place.address,
					place.address2,
					place.state,
					place.city,
					place.items
				)
			}

			console.log('✅ Banco inicializado com sucesso!')
		} else {
			console.log(`✅ Banco já possui ${count.count} registros`)
		}
	} catch (error) {
		console.error('❌ Erro ao fazer seed do banco:', error)
	}
}

module.exports = seedDatabase
