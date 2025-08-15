import { IOrder, IProduct } from "./webApi";

export interface ICatalogModel{
    items: IProduct[];

    setItems(items: IProduct[]): void;
    getItem(id: string): IProduct
}

export interface IBasketModel{
    items: IProduct[]

    add(id: string): void
    remove(id: string): void
    allRemove(): void
    getItem(id: string): IProduct
}

export interface IFormModel{
    orderObject: IOrder

    setPaymentAndAddress(payment: string, address: string): void
    setContacts(email: string, phone: string): void
    allRemove(): void
}