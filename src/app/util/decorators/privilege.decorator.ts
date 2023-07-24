import { PrivilegeCore } from '@services/privilege'

export const Privilege = (...privileges: string[]) => {
    return PrivilegeCore.addPrivilege(...privileges)
}
