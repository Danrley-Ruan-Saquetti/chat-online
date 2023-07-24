import { FastifyRequest, FastifyReply } from 'fastify'
import { UserAuthenticate } from '@@types/auth'

export type Request = FastifyRequest
export type Response = FastifyReply
export type Next = (err?: any) => void

export type RequestAuthenticate = Request & {
    user: UserAuthenticate
}
