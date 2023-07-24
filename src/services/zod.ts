import { Injectable } from '@nestjs/common'
import { z } from 'zod'
import { Result } from '@esliph/util-node'
import { ResultException } from '@util/exceptions/result.exception'

@Injectable()
export class ZodValidateService {
    static performParse<ZodSchema extends z.Schema>(data: z.input<ZodSchema>, schema: ZodSchema): Result<z.output<ZodSchema>> {
        try {
            const resParse = schema.parse(data)

            const result = Result.success<z.output<ZodSchema>>(resParse)

            return result
        } catch (err: any) {
            const resultError = ZodValidateService.getPerformError(err)

            throw new ResultException(resultError.getError(), resultError.getStatus())
        }
    }

    private static getPerformError<ZodSchema extends z.Schema>(err: any) {
        if (err instanceof z.ZodError) {
            return ZodValidateService.getPerformErrorIfInstanceofZodError(err)
        }

        return Result.failure<z.output<ZodSchema>>({ title: 'Formatter data', message: [{ message: err, origin: 'FormatData' }] }, 400)
    }

    private static getPerformErrorIfInstanceofZodError<ZodSchema extends z.Schema>(err: z.ZodError) {
        const dataErrors = err.errors.map(_err => {
            return { message: _err.message, origin: _err.path.join(';') }
        })

        return Result.failure<z.output<ZodSchema>>({ title: 'Formatter data', message: dataErrors }, 400)
    }

    public static defaultSchemaModelTable() {
        const objectDefault = z.object({
            id: z
                .union([z.string(), z.number()])
                .refine(value => !isNaN(Number(value)))
                .transform(value => Number(value))
        })

        return objectDefault
    }
}
