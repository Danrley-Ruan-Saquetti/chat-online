import axios, { CreateAxiosDefaults, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'

export class API {
    private constructor() { }

    public static createApi(config?: CreateAxiosDefaults<any>) {
        const api = new ApiCore(config)

        return api
    }
}

export class ApiCore {
    private api: AxiosInstance

    constructor(config?: CreateAxiosDefaults<any>) {
        this.api = axios.create(config)
    }

    public async get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        const response = await this.api.get<T, R, D>(url, config).then(res => res).catch(err => err)

        return response
    }

    public async post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        const response = await this.api.post<T, R, D>(url, data, config).then(res => res).catch(err => err)

        return response
    }

    public async delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        const response = await this.api.delete<T, R, D>(url, config).then(res => res).catch(err => err)

        return response
    }

    public async put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        const response = await this.api.put<T, R, D>(url, data, config).then(res => res).catch(err => err)

        return response
    }

    public getUri(config?: AxiosRequestConfig) {
        const response = this.api.getUri(config)

        return response
    }

    public async request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>) {
        const response = await this.api.request<T, R, D>(config).then(res => res).catch(err => err)

        return response
    }

    public async head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        const response = await this.api.head<T, R, D>(url, config).then(res => res).catch(err => err)

        return response
    }

    public async postForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        const response = await this.api.postForm<T, R, D>(url, data, config).then(res => res).catch(err => err)

        return response
    }

    public async putForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        const response = await this.api.putForm<T, R, D>(url, data, config).then(res => res).catch(err => err)

        return response
    }

    public async patchForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        const response = await this.api.patchForm<T, R, D>(url, data, config).then(res => res).catch(err => err)

        return response
    }
}
