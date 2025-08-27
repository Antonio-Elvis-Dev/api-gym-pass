import { PrismaUsersRepository } from './../../repositories/prisma/prisma-users-repository';
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from '../register'
import { compare } from 'bcryptjs'

// Unit Test - testes unitarios 

describe('Register Use Case', () => {
    it('should hash user password upon registration', async () => {
        const prismaUsersRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase({

            findByEmail: async (email) => null,

            async create(data) {
                return {
                    id: 'user-1',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date()
                }
            }
        })

        const { user } = await registerUseCase.execute({
            name: 'Elvis', email: 'johyy@example', password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        )
        expect(isPasswordCorrectlyHashed).toBe(true)
    })
})