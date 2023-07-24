const Generator = require('yeoman-generator')
const fs = require('node:fs')
const path = require('node:path')

const filesTmp = [
    { template: 'schema.txt', dist: 'schema.ts' },
    { template: 'dependencies.txt', dist: 'dependencies.ts' },
    { template: 'moduleName.controller.txt', dist: 'moduleName.controller.ts' },
    { template: 'moduleName.module.txt', dist: 'moduleName.module.ts' },
    { template: 'repository.module.txt', dist: 'repository.module.ts' },
    { template: 'use-case.module.txt', dist: 'use-case.module.ts' },
    { template: 'moduleName.service.txt', dist: 'moduleName.service.ts' },
    { template: 'repository/repository.txt', dist: 'repository/repository.ts' },
    { template: 'repository/create.repository.txt', dist: 'repository/create.repository.ts' },
    { template: 'repository/update.repository.txt', dist: 'repository/update.repository.ts' },
    { template: 'repository/delete.repository.txt', dist: 'repository/delete.repository.ts' },
    { template: 'repository/find.repository.txt', dist: 'repository/find.repository.ts' },
    { template: 'use-case/list.use-case.txt', dist: 'use-case/list.use-case.ts' },
    { template: 'use-case/find-one.use-case.txt', dist: 'use-case/find-one.use-case.ts' },
    { template: 'use-case/create.use-case.txt', dist: 'use-case/create.use-case.ts' },
    { template: 'use-case/update.use-case.txt', dist: 'use-case/update.use-case.ts' },
    { template: 'use-case/delete.use-case.txt', dist: 'use-case/delete.use-case.ts' }
]

function deleteFolderRecursiveSync(folderPath = '') {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach(file => {
            const curPath = path.join(folderPath, file)
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursiveSync(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(folderPath)
    }
}

module.exports = class extends Generator {
    async prompting() {
        this.argument('moduleName', { type: String, required: false })
        this.argument('moduleNames', { type: String, required: false })
        this.argument('ModuleName', { type: String, required: false })
        this.argument('ModuleNames', { type: String, required: false })

        const captureNameValid = /^[A-Za-z]+$/

        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'moduleName',
                message: 'Name module main:',
                when: () => !this.options.moduleName,
                validate: moduleName => captureNameValid.test(moduleName)
            },
            {
                type: 'input',
                name: 'moduleNames',
                message: 'Name module in plural:',
                when: () => !this.options.moduleNames,
                validate: moduleNames => captureNameValid.test(moduleNames)
            },
            {
                type: 'input',
                name: 'ModuleName',
                message: 'Name module in capital letter:',
                when: () => !this.options.ModuleName,
                validate: ModuleName => captureNameValid.test(ModuleName)
            },
            {
                type: 'input',
                name: 'ModuleNames',
                message: 'Name module in capital letter and in plural:',
                when: () => !this.options.ModuleNames,
                validate: ModuleNames => captureNameValid.test(ModuleNames)
            }
        ])

        if (
            (this.options.moduleName && !captureNameValid.test(this.options.moduleName)) ||
            (this.options.moduleNames && !captureNameValid.test(this.options.moduleNames)) ||
            (this.options.ModuleNames && !captureNameValid.test(this.options.ModuleNames)) ||
            (this.options.ModuleName && !captureNameValid.test(this.options.ModuleName))
        ) {
            throw new Error('Arguments invalid')
        }

        this.answers.moduleName = this.options.moduleName || this.answers.moduleName
        this.answers.moduleNames = this.options.moduleNames || this.answers.moduleNames
        this.answers.ModuleName = this.options.ModuleName || this.answers.ModuleName
        this.answers.ModuleNames = this.options.ModuleNames || this.answers.ModuleNames
    }

    paths() {
        const { moduleName, moduleNames, ModuleName, ModuleNames } = this.answers

        filesTmp.forEach(({ dist, template }) => {
            this.fs.copyTpl(
                this.templatePath(template),
                this.destinationPath(
                    `../app/modules/${this.answers.moduleName.split(' ').join('-')}/${dist
                        .replace('moduleName', moduleName)
                        .replace('moduleNames', moduleNames)
                        .replace('ModuleNames', ModuleNames)
                        .replace('ModuleName', ModuleName)}`
                ),
                { moduleName, ModuleName, moduleNames, ModuleNames }
            )
        })
    }

    end() {
        this.log(`Module "${this.answers.moduleName}" created`)
    }
}
