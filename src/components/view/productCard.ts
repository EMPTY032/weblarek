import { IProduct, TProductId } from '../../types/types';
import { CDN_URL } from '../../utils/constants';
import { IEvents } from '../base/events';
import { Component } from './baseView';

export class ProductCardView extends Component<IProduct> {
	element: HTMLElement;
	events: IEvents;

	itemId: string;
	category: HTMLElement;
	title: HTMLElement;
	image: HTMLImageElement;
	price: HTMLElement;

	constructor(element: HTMLElement, events: IEvents) {
		super(element);
		this.events = events;

		this.category = this.element.querySelector('.card__category');
		this.title = this.element.querySelector('.card__title');
		this.image = this.element.querySelector('.card__image');
		this.price = this.element.querySelector('.card__price');

		this.element.addEventListener('click', () => {
			this.events.emit<TProductId>('product:open', { id: this.itemId });
		});
	}

	render(data: IProduct): HTMLElement {
		if (data) {
			this.itemId = data.id;
			this.category.textContent = data.category;
			this.title.textContent = data.title;
			this.image.src = CDN_URL + '' + data.image;
			if (data.price) {
				this.price.textContent = data.price + ` синапсов`;
			} else {
				this.price.textContent = `Бесценно`;
			}
		}

		return this.element;
	}
}

export class ProductCardPreView extends ProductCardView {
	description: HTMLElement;
	button: HTMLButtonElement;
	element: HTMLElement;
	events: IEvents;

	private productInBasket: boolean = false;

	constructor(element: HTMLElement, events: IEvents) {
		super(element, events);

		this.description = this.element.querySelector('.card__text');
		this.button = this.element.querySelector('.card__button');

		this.button.addEventListener('click', () => {
			this.productInBasket = this.productInBasket ? false : true;
			this.buttonStatus(this.productInBasket);
			this.events.emit<TProductId>('product:addBasket', { id: this.itemId });
		});
	}

	buttonStatus(productInBasket: boolean) {
		this.button.textContent = productInBasket
			? 'Удалить из корзины'
			: 'В корзину';
	}

	disabledButton(unplug: boolean) {
		this.button.disabled = unplug;
	}

	render(data: IProduct): HTMLElement {
		super.render(data);
		if (data) {
			this.description.textContent = data.description;
			if (data.price === null) {
				this.disabledButton(true);
			}
		}

		return this.element;
	}
}
