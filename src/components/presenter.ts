import { Api, ApiListResponse, ApiPostMethods } from './base/api';
import { IEvents } from './base/events';
import { IOrder, IProduct, IWebApi, OrderResult } from '../types/types';

export class WebLarekApi implements IWebApi {
	API: Api;

	constructor(API: Api) {
		this.API = API;
	}

	productList(): Promise<IProduct[]> {
		return this.API.get<ApiListResponse<IProduct>>('/product').then(
			(value: ApiListResponse<IProduct>) => {
				return value.items;
			}
		);
	}

	productItem(id: string): Promise<IProduct> {
		return this.API.get<IProduct>(`/product/${id}`).then(
			(product: IProduct) => {
				return product;
			}
		);
	}

	orderProduct(order: IOrder): Promise<OrderResult> {
		return this.API.post('/order', order);
	}
}
