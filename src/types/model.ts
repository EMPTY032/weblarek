import { IEvents } from '../components/base/events';
import { IOrder, IProduct } from './webApi';

export type TProductId = Pick<IProduct, 'id'>;

export type TBascketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

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

export class Order implements IOrderModel {
	items: TBascketItem[] = [];
	order: IOrder;
	events: IEvents;
	formErrors: TFormErrors = {};

	constructor(events: IEvents) {
		this.events = events;
	}

	addProduct(item: TBascketItem): void {
		if (!this.items.some((i) => i.id === item.id)) {
			this.items.push(item);
			this.events.emit('totalUpdated', { total: this.getTotal() });
		}
	}

	removeProduct(productId: TProductId): void {
		const removeIndex = this.items.findIndex((item) => item.id == productId.id);
		if (removeIndex !== -1) {
			this.items.splice(removeIndex, 1);
			this.events.emit('totalUpdated', { total: this.getTotal() });
		}
	}

	getTotal(): number {
		return this.items.reduce((sum, i) => sum + Number(i.price), 0);
	}

	clearBascket(): void {
		this.items = [];
		this.events.emit('totalUpdated', { total: this.getTotal() });
	}

	clearDataForm(): void {
		this.order.payment = '';
		this.order.address = '';
		this.order.email = '';
		this.order.phone = '';
		this.formErrors = {};
		//Событие изменения ошибок валидации
	}

	setOrderPayment(fied: keyof TOrderPayment, value: string): void {
		this.order[fied] = value;
		//Событие изменения ордера
	}

	setOrderContacts(fied: keyof TOrderContacts, value: string): void {
		this.order[fied] = value;
		//Событие изменения ордера
	}

	validatePayment(): void {
		const errors = { ...this.formErrors };

		if (!String(this.order.payment || '').trim) {
			errors.payment = 'Выберите способ оплаты';
		} else {
			delete errors.payment;
		}

		if (!String(this.order.address || '').trim) {
			errors.address = 'Введите адрес доставки';
		} else {
			delete errors.address;
		}

		this.formErrors = errors;
		this.events.emit('formErrorsOrder:change', { errors: this.formErrors });
	}

	validateContacts(): void {
		const errors = { ...this.formErrors };

		if (!String(this.order.phone || '').trim) {
			errors.payment = 'Введите свой номер телефона';
		} else {
			delete errors.payment;
		}

		if (!String(this.order.email || '').trim) {
			errors.address = 'Введите свою электронную почту';
		} else {
			delete errors.address;
		}

		this.formErrors = errors;
		//Событие изменения ошибок формы
	}
}
