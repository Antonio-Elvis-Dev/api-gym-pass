import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { after } from 'node:test';

// Unit Test - testes unitarios 


let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase // system under test

describe('Check-in Use Case', () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository)
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    // Teste para validar que o usuario pode fazer check-in
    it('should be able to check in', async () => {

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })
        expect(checkIn.id).toEqual(expect.any(String))

    })

    // Teste para validar que o usuario nao pode fazer check-in duas vezes no mesmo dia
    // TDD: red - green - refactor

    it('should not be able to check in twice in the same day', async () => {

        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)) // 20 de janeiro de 2023 as 8:00
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        await expect(() =>

            sut.execute({
                gymId: 'gym-01',
                userId: 'user-01'
            })
        ).rejects.toBeInstanceOf(Error)


    })
    it('should be able to check in twice but in different days', async () => {

        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)) // 20 de janeiro de 2023 as 8:00
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0)) // 20 de janeiro de 2023 as 8:00
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        expect(checkIn.id).toEqual(expect.any(String))




    })





})