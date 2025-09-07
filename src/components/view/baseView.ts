import { isEmpty } from '../../utils/utils';

interface IView {
	element: HTMLElement;
	render(data?: unknown): HTMLElement;
}

export class Component<T> implements IView {
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
