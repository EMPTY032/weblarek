import { IEvents } from '../components/base/events';
import { CDN_URL } from '../utils/constants';
import { isEmpty } from '../utils/utils';
import { TBascketItem, TFormErrors, TProductId } from './model';
import { IOrder, IProduct } from './webApi';

interface IView {
	element: HTMLElement;
	render(data?: unknown): HTMLElement;
}

class Component<T> implements IView {
	element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = element;
	}

	toggleClass(className: string) {
		this.element.classList.toggle(className);
		return this;
	}

	setText(text: string) {
		if (!isEmpty(text)) {
			if (this.element instanceof HTMLImageElement) {
				this.element.alt = text;
			} else {
				this.element.textContent = text;
			}
		}

		return this;
	}

	setDisable(bool: boolean) {
		if (
			this.element instanceof HTMLButtonElement ||
			this.element instanceof HTMLInputElement ||
			this.element instanceof HTMLSelectElement
		) {
			this.element.disabled = bool;
		}
		return this;
	}

	setHidden(bool: boolean) {
		this.element.hidden = bool;
		return this;
	}

	setVisible(bool: boolean, display?: string) {
		if (!bool) {
			this.element.style.display = 'none';
		} else {
			this.element.style.display = display || 'block';
		}
		return this;
	}

	setImage(link: string) {
		if (this.element instanceof HTMLImageElement) {
			this.element.src = link;
		}
		return this;
	}

	render(data?: T) {
		return this.element;
	}
}

export class Modal {
	modal: HTMLElement;
	events: IEvents;
	content: HTMLElement;

	constructor(element: HTMLElement, events: IEvents) {
		this.modal = element;
		this.events = events;
		this.content = this.modal.querySelector('.modal__content');

		this.modal.querySelector('.modal__close').addEventListener('click', () => {
			this.events.emit('modal:close');
		});

		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) {
				this.events.emit('modal:close');
			}
		});
	}

	open() {
		this.modal.classList.add('modal_active');
	}

	close() {
		this.modal.classList.remove('modal_active');
	}

	setContent(content: HTMLElement) {
		this.clearContent();
		this.content.appendChild(content);
		return this;
	}

	clearContent() {
		this.content.innerHTML = '';
	}
}

export class ProductCardView extends Component<IProduct> implements IView {
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

	productDo: string = 'product:addBasket';
	productInBasket: boolean = false;

	constructor(element: HTMLElement, events: IEvents) {
		super(element, events);

		this.description = this.element.querySelector('.card__text');
		this.button = this.element.querySelector('.card__button');

		this.button.addEventListener('click', () => {
			event.stopPropagation();
			console.log('клик');
			this.productInBasket ? this.buttonStatus(false) : this.buttonStatus(true);
			this.events.emit<TProductId>(this.productDo, { id: this.itemId });
		});
	}

	buttonStatus(productInBasket: boolean) {
		this.button.textContent = productInBasket
			? 'Удалить из корзины'
			: 'В корзину';
		this.productDo = productInBasket
			? 'product:removeBasket'
			: 'product:addBasket';
		this.productInBasket = productInBasket;
	}

	disabledButton(unplug: boolean) {
		this.button.disabled = unplug;
	}

	render(data: IProduct): HTMLElement {
		super.render(data);
		if (data) {
			this.description.textContent = data.description;
		}

		return this.element;
	}
}

export class Basket extends Component<IProduct> implements IView {
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
			this.events.emit('basket:submit', {});
		});
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
			this.price.textContent = data.price + ' синапсов';
		}

		return this.element;
	}
}

export class Page extends Component<object> {
	elementCounter: HTMLElement;
	buttonBascket: HTMLButtonElement;
	galleryCard: HTMLElement;
	events: IEvents;
	element: HTMLElement;

	constructor(element: HTMLElement, events: IEvents) {
		super(element);
		this.events = events;
		this.elementCounter = this.element.querySelector('.header__basket-counter');
		this.buttonBascket = this.element.querySelector('.header__basket');
		this.galleryCard = this.element.querySelector('.gallery');

		this.buttonBascket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	setLocked(value: boolean) {
		value
			? (this.element.style.overflow = 'hidden')
			: (this.element.style.overflow = 'visible');
	}
}

export class Form extends Component<TFormErrors> {
	submit: HTMLButtonElement;
	events: IEvents;
	element: HTMLElement;

	constructor(element: HTMLElement, events: IEvents) {
		super(element);
		this.events = events;
		this.submit = this.element.querySelector('.modal__actions');

		this.element.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			if (target && target.name)
				this.onInputChange(target.name as keyof TFormErrors, target.value);
		});
	}

	reset() {
		(this.element as HTMLFormElement).reset();
	}

	onInputChange(field: keyof TFormErrors, value: string) {
		this.events.emit('form:change', { field, value });
	}

	render(): HTMLElement {
		return this.element;
	}
}

export class FormPayment extends Form {
	paymentButtons: NodeListOf<HTMLButtonElement>;
	selected: string;

	constructor(element: HTMLElement, events: IEvents) {
		super(element, events);
		this.paymentButtons = element.querySelectorAll('.button_alt');

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.selected = button.name;
				this.onInputChange('payment', this.selected);
			});
		});
	}

	reset(): void {
		super.reset();
		this.selected = '';
	}
}

export class FormContacts extends Form {
	constructor(element: HTMLElement, events: IEvents) {
		super(element, events);
	}
}

export class FormSuccies extends Component<{ total: number }> {
	total: HTMLElement;
	constructor(element: HTMLElement) {
		super(element);
		this.total = element.querySelector('.order-success__description');
	}

	render(data: { total: number }): HTMLElement {
		this.total.textContent = `Списанно ${data.total} синапсов`;
		return this.element;
	}
}
