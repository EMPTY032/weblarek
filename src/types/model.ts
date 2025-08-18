import { IOrder, IProduct } from "./webApi";

export type TProductId = Pick<IProduct, "id">

export type TBascketItem = Pick<IProduct, "id" | "title" | "price">

export type TOrderPayment = Pick<IOrder, "payment" | "address">

export type TOrderContacts = Pick<IOrder, "email" | "phone">

export type TFormErrors = Partial<Record<keyof IOrder, string>>

export interface ICatalogModel{
    items: IProduct[];

    setItemList(items: IProduct[]): void;
    getItemList(): IProduct[]
    getItem(id: TProductId): IProduct

}

export interface IOrderModel{
    items: TBascketItem[]
    order: IOrder

    addProduct(item: TBascketItem): void
    remove(id: TProductId): void
    getTotal(): number
}