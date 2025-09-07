import { IEvents } from '../base/events';

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
