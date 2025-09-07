import { TFormErrors } from '../../types/types';
import { IEvents } from '../base/events';
import { Component } from './baseView';

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

	disableButton(button: HTMLButtonElement, value: boolean) {
		button.disabled = value;
	}

	reset() {
		(this.element as HTMLFormElement).reset();
	}

	onInputChange(field: keyof TFormErrors, value: string) {
		this.events.emit(`order.${field}:change`, { value });
	}

	render(): HTMLElement {
		return this.element;
	}
}

export class FormPayment extends Form {
	paymentButtons: NodeListOf<HTMLButtonElement>;
	selected: string;
	orderButton: HTMLButtonElement;

	constructor(element: HTMLElement, events: IEvents) {
		super(element, events);
		this.paymentButtons = element.querySelectorAll('.button_alt');
		this.orderButton = element.querySelector('.order__button');

		this.orderButton.addEventListener('click', () => {
			this.events.emit('order:submit');
		});

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.selected = button.name;

				this.paymentButtons.forEach((button) =>
					button.classList.remove('button_alt-active')
				);

				button.classList.add('button_alt-active');

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
	button: HTMLButtonElement;
	constructor(element: HTMLElement, events: IEvents) {
		super(element, events);
		this.button = element.querySelector('.button');

		this.button.addEventListener('click', () => {
			this.events.emit('contacts:submit');
		});
	}
}

export class FormSuccess extends Component<{ total: number }> {
	total: HTMLElement;
	events: IEvents;

	constructor(element: HTMLElement, events: IEvents) {
		super(element);
		this.events = events;
		this.total = this.element.querySelector('.order-success__description');
		this.element
			.querySelector('.order-success__close')
			.addEventListener('click', () => {
				this.events.emit('modal:close');
			});
	}

	render(data: { total: number }): HTMLElement {
		this.total.textContent = `Списанно ${data.total} синапсов`;
		return this.element;
	}
}
