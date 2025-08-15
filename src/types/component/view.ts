export interface IView{
    render(data?: object): HTMLElement
}

export interface IViewConstructor{
    new (container: HTMLElement, setting: object): IView
}

interface ProductSetting{
    category: string;
    title: string;
    image: string;
    price: number;
    description: string;
    fullClass: string
    mediumClass: string
    lowClass: string
    size: string
}