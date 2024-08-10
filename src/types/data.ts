export interface ValidateData {
    code: number,
    message: string
}

export interface Data {
    attr: number,
    color: number,
    content: string,
    ctime: string,
    fontsize: number,
    id: string,
    idStr: string,
    midHash: string,
    mode: number,
    progress: number,
    weight: number
}

export interface ResData {
    bvid: string,
    data: Data[],
    title: string
}

export interface PlotData {
    count: number,
    clicked: boolean
}