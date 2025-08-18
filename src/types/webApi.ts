export interface IProduct{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IOrder{
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: IProduct[];
}

interface OrderResult{
    id: string;
    total: number
}

export interface IWebApi{
    productList: () => Promise<IProduct[]>;
    produtItem: (id: string) => Promise<IProduct>
    orderProduct: (order: IOrder) => Promise<OrderResult>
}