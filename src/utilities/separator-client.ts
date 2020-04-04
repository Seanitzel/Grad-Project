import { http } from './axios-client'

class separtorClient {
    // @ts-ignore
    upload (file, stems) {
        const formData = new FormData()

        formData.append('file', file)
        formData.append('stems', stems)

        return http.post('/separator', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob'
        })
    }
}

export default new separtorClient()
