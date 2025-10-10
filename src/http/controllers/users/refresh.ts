import { FastifyRequest, FastifyReply } from "fastify"


export async function refresh(request: FastifyRequest, reply: FastifyReply) {



  await request.jwtVerify({ onlyCookie: true })

  const {sub} = request.user


  
    const token = await reply.jwtSign(
      {}, {
      sign: {
        sub: sub
      }
    })
    const refreshToken = await reply.jwtSign(
      {}, {
      sign: {
        sub: sub,
        expiresIn: '7d'
      }
    })
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true, //HTTPS
        sameSite: "lax",
        httpOnly: true
      })
      .status(200).send({
        token
      })
 

} 