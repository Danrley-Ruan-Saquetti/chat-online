import { HashEsliph } from '@esliph/util-node'
import { User as UserModelPrisma } from '@prisma/client'

export type UserModelTable = UserModelPrisma

export type UserModelSimple = {
    username: string
    email: string
    password: string
}

export class UserEntityTable implements UserModelTable {
    id: number
    username: string
    email: string
    password: string
    createAt: Date
    updateAt: Date

    constructor({ createAt, email, id, password, updateAt, username }: UserModelTable) {
        this.id = id
        this.createAt = createAt
        this.updateAt = updateAt
        this.password = password
        this.email = email
        this.username = username
    }

    update({ email, username }: Partial<Pick<UserModelTable, 'email' | 'username'>>) {
        if (email) this.email = email
        if (username) this.username = username
        this.updateAt = new Date(Date.now())
    }
}

export class UserEntitySimple implements UserModelSimple {
    username: string
    email: string
    password: string

    constructor({ email, password, username }: Omit<UserModelSimple, 'online'>) {
        this.email = email
        this.password = password
        this.username = username
    }

    async cryptPassword() {
        const passwordHash = await HashEsliph.generateHash(this.password)

        this.password = passwordHash
    }
}
