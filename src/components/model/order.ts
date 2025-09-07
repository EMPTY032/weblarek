import {
	IOrder,
	IOrderModel,
	TBascketItem,
	TFormErrors,
	TOrderContacts,
	TOrderPayment,
	TProductId,
} from '../../types/types';
import { IEvents } from '../base/events';

export class Order implements IOrderModel {
	items: TBascketItem[] = [];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	events: IEvents;
	formErrors: TFormErrors = {};

	constructor(events: IEvents) {
		this.events = events;
	}

	addProduct(product: TBascketItem): void {
		if (!this.hasProduct({ id: product.id })) {
			this.items.push(product);
		}
	}

	hasProduct(id: TProductId) {
		return this.items.some((item) => item.id === id.id);
	}

	removeProduct(productId: TProductId): void {
		const removeIndex = this.items.findIndex((item) => item.id == productId.id);
		if (removeIndex !== -1) {
			this.items.splice(removeIndex, 1);
		}
	}

	getTotal(): number {
		return this.items.reduce((sum, i) => sum + Number(i.price), 0);
	}

	clearBascket(): void {
		this.items = [];
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
		this.validatePayment();
	}

	setOrderContacts(fied: keyof TOrderContacts, value: string): void {
		this.order[fied] = value;
		this.validateContacts();
	}

	validatePayment(): void {
		const errors = { ...this.formErrors };

		if (!String(this.order.payment || '').trim()) {
			errors.payment = 'Выберите способ оплаты';
		} else {
			delete errors.payment;
		}

		if (!String(this.order.address || '').trim()) {
			errors.address = 'Введите адрес доставки';
		} else {
			delete errors.address;
		}

		this.formErrors = errors;
		this.events.emit('formErrorsOrder:change', { errors: this.formErrors });
	}

	validateContacts(): void {
		const errors = { ...this.formErrors };

		if (!String(this.order.phone || '').trim()) {
			errors.payment = 'Введите свой номер телефона';
		} else {
			delete errors.payment;
		}

		if (!String(this.order.email || '').trim()) {
			errors.address = 'Введите свою электронную почту';
		} else {
			delete errors.address;
		}

		this.formErrors = errors;
		this.events.emit('formErrorsContacts:change', { errors: this.formErrors });
	}
}
