import { Result } from '@esliph/util-node'
import { Injectable } from '@nestjs/common'

export type AuthValidatePrivilegeUseCaseArgs = {
    id: number, privileges: string[]
}

const privilegesInUser: { [x: number]: string[] } = {
    1: ['users/list']
}

@Injectable()
export class AuthValidatePrivilegeUseCase {
    constructor() { }

    async perform(args: AuthValidatePrivilegeUseCaseArgs) {
        const allPrivilegies = privilegesInUser[args.id]

        const validPrivileges = args.privileges.some(privilegeRequest => !allPrivilegies.find(privilege => privilegeRequest == privilege))

        if (validPrivileges) {
            return Result.failure({ title: 'Validate Privileges', message: [] })
        }

        return Result.success(false)
    }
}
