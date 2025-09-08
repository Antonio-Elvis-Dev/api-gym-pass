
import { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { MaxDistanceError } from "./errors/max-distance-error";
import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";


interface FetchUserCheckInsHistoryUseCaseRequest {
    userId: string
   
}
interface FetchUserCheckInsHistoryUseCaseResponse {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {

    constructor(
        private checkInsRepository: CheckInsRepository, // dependencia de fetchUserCheckInsHistory
        private gymsRepository: GymsRepository // dependencia de gym
    ) { }

    async execute({
        gymId,
        
    }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {

        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1 // 100 metros

        if (distance > MAX_DISTANCE_IN_KILOMETERS) { // 0.1 km = 100 metros
            throw new MaxDistanceError()
        }

        const fetchUserCheckInsHistoryInSameDay = await this.checkInsRepository.findByUserIdOnDate(
            userId,
            new Date() // data atual
        )

        if (fetchUserCheckInsHistoryInSameDay) {
            throw new Error()
        }

        const fetchUserCheckInsHistory = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            fetchUserCheckInsHistory,
        }
    }
}