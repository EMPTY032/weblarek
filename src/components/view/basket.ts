import { IProduct, TBascketItem } from '../../types/types';
import { IEvents } from '../base/events';
import { Component } from './baseView';

export class Basket extends Component<IProduct> {
	list: HTMLElement;
	total: HTMLElement;
	orderButton: HTMLButtonElement;

	events: IEvents;

	constructor(element: HTMLElement, events: IEvents) {
		super(element);
		this.events = events;

		this.list = this.element.querySelector('.basket__list');
		this.orderButton = this.element.querySelector('.basket__button');
		this.total = this.element.querySelector('.basket__price');

		this.orderButton.addEventListener('click', () => {
			this.events.emit('basket:submit');
		});
	}

	listStatus(haveProduct: boolean) {
		if (!haveProduct) {
			this.list.textContent = 'Корзина пуста';
			this.list.style.opacity = '0.3';
			this.orderButton.disabled = true;
		} else {
			this.list.style.opacity = '1';
			this.orderButton.disabled = false;
		}
	}

	setTotal(total: number) {
		this.total.textContent = total + ' синапсов';
	}
}

export class BasketItem extends Component<TBascketItem> {
	itemId: string;
	count: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	deleteButton: HTMLButtonElement;
	element: HTMLElement;
	events: IEvents;

	constructor(element: HTMLElement, events: IEvents) {
		super(element);
		this.events = events;
		this.count = this.element.querySelector('.basket__item-index');
		this.title = this.element.querySelector('.card__title');
		this.price = this.element.querySelector('.card__price');
		this.deleteButton = this.element.querySelector('.basket__item-delete');
		this.deleteButton.addEventListener('click', () => {
			this.element.remove();
			this.events.emit('product:removeBasket', { id: this.itemId });
		});
	}

	setCounter(value: number) {
		this.count.textContent = String(value);
	}

	render(data: TBascketItem): HTMLElement {
		if (data) {
			this.itemId = data.id;
			this.title.textContent = data.title;
			if (data.price) {
				this.price.textContent = data.price + ' синапсов';
			} else {
				this.price.textContent = 'Бесценно';
			}
		}

		return this.element;
	}
}
