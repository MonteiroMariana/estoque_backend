import bcrypt from 'bcrypt'
import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

router.post('/usuarios', async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body as {
    nome: string
    email: string
    senha: string
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10)
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaCriptografada }
    })
    res
      .status(201)
      .json({ message: 'Usuário criado com sucesso!', usuario: novoUsuario })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error })
  }
})

router.post('/login', async (req: Request, res: any) => {
  const { email, senha } = req.body as { email: string; senha: string }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario)
      return res.status(404).json({ message: 'Usuário não encontrado' })

    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida)
      return res.status(401).json({ message: 'Senha incorreta' })

    res.status(200).json({ message: 'Login realizado com sucesso' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao fazer login', error })
  }
})

export default router
