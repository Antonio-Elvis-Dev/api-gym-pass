import { CheckIn } from "@/generated/prisma";
import { CheckInsRepository } from "@/repositories/check-ins-repository";


interface CheckInUseCaseRequest {
    userId: string
    gymId: string
}
interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {

    constructor(
        private checkInsRepository: CheckInsRepository,
    ) { }

    async execute({
        gymId,
        userId
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

        const checkInInSameDay = await this.checkInsRepository.findByUserIdOnDate(
            userId,
            new Date() // data atual
        )

        if(checkInInSameDay){
            throw new Error('User has already checked in today.')
        }

        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            checkIn,
        }
    }
}