import 'dotenv/config'
import { app } from './server.js';

const PORT = process.env.PORT || 3000

app.listen(PORT,() => {
    console.log(`App listening on port ${PORT}`)
})
