// Arquivo de entrada que inicia o servidor
const server = require('./server.js')

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
	console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})
