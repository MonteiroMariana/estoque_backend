import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createProduto = async (data:any) => {
  return await prisma.produto.create({
    data
  })
}

export const findProdutoById = async (id:number) => {
  return await prisma.produto.findUnique({
    where: { id }
  })
}

export const findAllProdutos = async () => {
  return await prisma.produto.findMany()
}

export const updateProdutoById = async (id:number, data:number) => {
  return await prisma.produto.update({
    where: { id },
    data
  })
}

export const deleteProdutoById = async (id:number) => {
  return await prisma.produto.delete({
    where: { id }
  })
}
