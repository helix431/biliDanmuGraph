import service from "@/utils/request";

interface ValidateData {
    code: number,
    message: string
}

export const validateCookie = (cookie: string) => {
    return service<any, ValidateData>({
        url: '/validate',
        method: 'post',
        data: {
            cookie
        }
    })
}