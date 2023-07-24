const GLOBAL_PERFORM_VALID_PRIVILEGES = {
    public: () => { return true },
    private: () => { return false },
    ignore: () => { return false },
}

export function ValidPrivileges(...privileges: string[]) {
    for (let i = 0; i < privileges.length; i++) {
        const privilegeName = privileges[i]

        if (!GLOBAL_PERFORM_VALID_PRIVILEGES[privilegeName]) { continue }

        if (!GLOBAL_PERFORM_VALID_PRIVILEGES[privilegeName]()) { return false }
    }

    return true
}
