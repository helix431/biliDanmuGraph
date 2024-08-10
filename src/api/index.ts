import service from "@/utils/request";

export const validateCookie = (cookie: string) => {
    return service({
        url: '/validate',
        method: 'post',
        data: {
            cookie
        }
    })
}