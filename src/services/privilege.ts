import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { MetadataControl } from '@services/metadata'

export const PRIVILEGE_KEY_NAME = 'privileges'

export class PrivilegeCore {
    private static privileges: string[] = []
    private static metadataController = new MetadataControl(new Reflector())

    static registerPrivilege(...privileges: string[]) {
        this.privileges.push(...privileges)
    }

    static getPrivileges(context: ExecutionContext) {
        const privileges = this.metadataController.get<string>(PRIVILEGE_KEY_NAME, context)

        return privileges
    }

    static addPrivilege(...privileges: string[]) {
        return this.metadataController.set(PRIVILEGE_KEY_NAME, ...privileges)
    }

    static getPrivilegesFiltered(context: ExecutionContext) {
        const privileges = this.getPrivileges(context)

        const privilegesFiltered = privileges.filter(privilegeContext => this.privileges.find(privilege => privilege == privilegeContext))

        return privilegesFiltered
    }
}