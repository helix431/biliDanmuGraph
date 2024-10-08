import service from "@/utils/request";

import type { Progress, ResData, ValidateData } from '@/types/data'

export const validateCookie = (cookie: string) => {
    return service<any, ValidateData>({
        url: '/validate',
        method: 'post',
        data: {
            cookie
        }
    })
}

export const getData = (bvid: string) => {
    return service<any, ResData>({
        url: '/data',
        method: 'post',
        data: {
            bvid
        }
    })
}

export const getProgress = () => {
    return service<any, Progress>({
        url: '/progress',
    })
}