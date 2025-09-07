import { ICatalogModel, IProduct, TProductId } from '../../types/types';
import { IEvents } from '../base/events';

export class Catalog implements ICatalogModel {
	items: IProduct[] = [];
	events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	setItemList(items: IProduct[]): void {
		this.items = Array.isArray(items) ? items : [];
		this.events.emit('productList:changed', this.items);
	}

	getItemList(): IProduct[] {
		return this.items;
	}

	getItem(productId: TProductId): IProduct {
		return this.items.find((item) => item.id == productId.id);
	}
}
