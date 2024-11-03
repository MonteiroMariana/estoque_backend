import dotenv from 'dotenv'

dotenv.config()
import express from 'express'
import { PrismaClient } from '@prisma/client'
import productRoutes from './routes/product.routes'
import usuarioRoutes from './routes/usuarioRoutes'

console.log('DATABASE_URL:', process.env.DATABASE_URL)

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not found in environment variables')
  process.exit(1)
}

const cors = require('cors')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
)

async function main() {
  try {
    await prisma.$connect()
    console.log('Conectado ao banco de dados com sucesso!')

    const novoProduto = await prisma.produto.create({
      data: {
        nome: 'Produto Exemplo',
        descricao: 'Descrição do Produto',
        imagem: 'https://encurtador.com.br/uAmqM',
        valor: 99.99,
        quantidade: 10
      }
    })
    console.log('Produto criado:', novoProduto)
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

app.use('/api', productRoutes)
app.use('/api', usuarioRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
  await main().catch(e => {
    console.error(e)
    process.exit(1)
  })
})
