import { IEvents } from '../base/events';
import { Component } from './baseView';

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

	setBasketCounter(count: number) {
		this.elementCounter.textContent = String(count);
	}

	setLocked(value: boolean) {
		value
			? (this.element.style.overflow = 'hidden')
			: (this.element.style.overflow = 'visible');
	}
}
