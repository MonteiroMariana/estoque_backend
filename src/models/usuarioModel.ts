import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createUsuario = async (data:any) => {
  return await prisma.usuario.create({
    data
  })
}

export const findUsuarioByEmail = async (email:string) => {
  return await prisma.usuario.findUnique({
    where: { email }
  })
}

export const findAllUsuarios = async () => {
  return await prisma.usuario.findMany()
}

export const deleteUsuarioById = async (id: number) => {
  return await prisma.usuario.delete({
    where: { id }
  })
}
