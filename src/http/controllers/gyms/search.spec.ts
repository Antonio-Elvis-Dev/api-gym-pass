import { Gym } from '@prisma/client';
import request from 'supertest'

import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gym (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })
    it('should be able to search a gyms by title', async () => {

        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JS Gym',
                description: 'some description',
                phone: '334324324',
                latitude: -9.406466,
                longitude: -36.629427,
            })
        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Python Gym',
                description: 'some description',
                phone: '334324324',
                latitude: -9.406466,
                longitude: -36.629427,
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                q: 'JS'
            }).set("Authorization", `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title:'JS Gym'
            })
        ])

    })
})