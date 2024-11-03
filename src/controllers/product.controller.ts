import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getProducts = async (req: any, res: any) => {
  try {
    const products = await prisma.produto.findMany()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
}

export const createProduct = async (req: any, res: any) => {
  const { nome, descricao, imagem, valor, quantidade } = req.body

  try {
    const newProduct = await prisma.produto.create({
      data: {
        nome, // Campo 'nome'
        descricao, // Campo 'descricao'
        imagem, // Campo 'imagem' (opcional)
        valor, // Campo 'valor'
        quantidade // Campo 'quantidade'
      }
    })
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' })
  }
}
