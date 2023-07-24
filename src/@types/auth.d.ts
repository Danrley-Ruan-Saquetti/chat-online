export type AuthenticationJWT = {
    sub: number
    username: string
    email: string;
    iat?: number
    exp?: number
}

export type UserAuthenticate = {
    id: number,
    email: string,
    username: string
}
