export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}

export interface OrderResult {
	id: string;
	total: number;
}

export interface IWebApi {
	productList: () => Promise<IProduct[]>;
	productItem: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrder) => Promise<OrderResult>;
}

export type TProductId = Pick<IProduct, 'id'>;

export type TBascketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

export type TFormErrors = Partial<
	Record<keyof Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>, string>
>;

export interface ICatalogModel {
	items: IProduct[];

	setItemList(items: IProduct[]): void;
	getItemList(): IProduct[];
	getItem(productId: TProductId): IProduct;
}

export interface IOrderModel {
	items: TBascketItem[];
	order: IOrder;

	addProduct(item: TBascketItem): void;
	removeProduct(productId: TProductId): void;
	getTotal(): number;
}
