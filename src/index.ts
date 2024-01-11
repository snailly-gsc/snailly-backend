import server from './server'

require('dotenv').config()
const port = process.env.PORT || 5000


server.listen(port, () => {
  console.log(`[Server] Listening on: http://localhost:${port}`)
})