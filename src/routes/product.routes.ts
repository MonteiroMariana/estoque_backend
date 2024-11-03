import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

function validarProduto(req: any, res: any, next: any) {
  const { nome, descricao, imagem, valor, quantidade } = req.body
  if (!nome || !descricao || !imagem || !valor || !quantidade) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
  }
  next()
}

router.post('/products/:id/entrada', async (req: any, res: any) => {
  const { id } = req.params
  const { quantidade } = req.body

  try {
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) }
    })
    if (!produto)
      return res.status(404).json({ message: 'Produto não encontrado' })

    const novoProduto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: { quantidade: produto.quantidade + quantidade }
    })

    await prisma.operacaoEstoque.create({
      data: { produtoId: parseInt(id), tipo: 'entrada', quantidade }
    })

    res
      .status(200)
      .json({ message: 'Entrada registrada com sucesso', produto: novoProduto })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar entrada', error })
  }
})

router.post('/products/:id/saida', async (req: any, res: any) => {
  const { id } = req.params
  const { quantidade } = req.body

  try {
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) }
    })
    if (!produto)
      return res.status(404).json({ message: 'Produto não encontrado' })

    if (produto.quantidade < quantidade) {
      return res
        .status(400)
        .json({ message: 'Quantidade insuficiente em estoque' })
    }

    const novoProduto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: { quantidade: produto.quantidade - quantidade }
    })

    await prisma.operacaoEstoque.create({
      data: { produtoId: parseInt(id), tipo: 'saida', quantidade }
    })

    res
      .status(200)
      .json({ message: 'Saída registrada com sucesso', produto: novoProduto })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar saída', error })
  }
})

router.get('/products', async (req: any, res: any) => {
  try {
    const produtos = await prisma.produto.findMany()
    res.status(200).json(produtos)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter produtos', error })
  }
})

router.post(
  '/products',

  validarProduto,
  async (req: any, res: any) => {
    const { nome, descricao, valor, imagem, quantidade } = req.body

    try {
      const novoProduto = await prisma.produto.create({
        data: {
          nome,
          descricao,
          imagem,
          valor: parseFloat(valor),
          quantidade: parseInt(quantidade)
        }
      })
      res.status(201).json(novoProduto)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar produto', error })
    }
  }
)

router.put('/products/:id', validarProduto, async (req, res) => {
  const { id } = req.params
  const { nome, descricao, imagem, valor, quantidade } = req.body

  try {
    const produtoAtualizado = await prisma.produto.update({
      where: { id: Number(id) },
      data: { nome, descricao, imagem, valor, quantidade }
    })
    res.status(200).json(produtoAtualizado)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto', error })
  }
})

router.delete('/products/:id', async (req, res) => {
  const { id } = req.params

  try {
    await prisma.produto.delete({ where: { id: Number(id) } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir produto', error })
  }
})

router.get('/products/:id', async (req: any, res: any) => {
  const { id } = req.params

  try {
    const produto = await prisma.produto.findUnique({
      where: { id: Number(id) }
    })
    if (!produto)
      return res.status(404).json({ message: 'Produto não encontrado' })

    res.status(200).json(produto)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter produto', error })
  }
})

router.get('/products/:id/historico', async (req: any, res: any) => {
  const { id } = req.params

  try {
    const operacoes = await prisma.operacaoEstoque.findMany({
      where: { produtoId: parseInt(id) },
      orderBy: { data: 'desc' }
    })

    if (operacoes.length === 0) {
      return res
        .status(404)
        .json({ message: 'Nenhuma operação encontrada para este produto' })
    }

    res.status(200).json(operacoes)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao obter histórico de operações', error })
  }
})

export default router
