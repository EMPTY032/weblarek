import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { WebLarekApi } from './components/presenter';

import { IProduct, TBascketItem, TFormErrors, TProductId } from './types/types';
import { API_URL } from './utils/constants';
import { Catalog } from './components/model/catalog';
import { Order } from './components/model/order';
import { Page } from './components/view/page';
import { Modal } from './components/view/modal';
import { Basket, BasketItem } from './components/view/basket';
import {
	ProductCardPreView,
	ProductCardView,
} from './components/view/productCard';
import { FormContacts, FormPayment, FormSuccess } from './components/view/form';

const cardTemplate =
	document.querySelector<HTMLTemplateElement>('#card-catalog').content;
const productCardPreViewTemplate =
	document.querySelector<HTMLTemplateElement>('#card-preview').content;
const basketTemplate =
	document.querySelector<HTMLTemplateElement>('#basket').content;
const cardBasketTemplate =
	document.querySelector<HTMLTemplateElement>('#card-basket').content;
const formPaymentTemplate =
	document.querySelector<HTMLTemplateElement>('#order').content;
const formContactsTemplate =
	document.querySelector<HTMLTemplateElement>('#contacts').content;
const formSuccessTemplate =
	document.querySelector<HTMLTemplateElement>('#success').content;

const pageElement = document.querySelector('.page') as HTMLElement;
const modalElement = document.querySelector('.modal') as HTMLElement;
const basketElemnt = basketTemplate.querySelector('.basket') as HTMLElement;
const formPaymentElement = formPaymentTemplate.querySelector(
	'.form'
) as HTMLElement;
const formContactsElement = formContactsTemplate.querySelector(
	'.form'
) as HTMLElement;
const formSuccessElement = formSuccessTemplate.querySelector(
	'.order-success'
) as HTMLElement;

formPaymentElement.addEventListener('submit', (e) => {
	e.preventDefault();
});

const api = new Api(API_URL);
const events = new EventEmitter();
const webLarekApi = new WebLarekApi(api);
const catalog = new Catalog(events);
const page = new Page(pageElement, events);
const modal = new Modal(modalElement, events);
const basket = new Basket(basketElemnt, events);
const formPayment = new FormPayment(formPaymentElement, events);
const formContacts = new FormContacts(formContactsElement, events);
const formSuccess = new FormSuccess(formSuccessElement, events);
const order = new Order(events);

webLarekApi.productList().then((items) => {
	catalog.setItemList(items);
});

events.on('productList:changed', (items: IProduct[]) => {
	page.galleryCard.replaceChildren(
		...items.map((item: IProduct) => {
			const cardElement = cardTemplate
				.querySelector('.card')
				.cloneNode(true) as HTMLElement;
			const productCardView = new ProductCardView(cardElement, events);
			const rendered = productCardView.render(item);
			return rendered;
		})
	);
});

events.on('product:open', (product: TProductId) => {
	const productCardPreViewElement = productCardPreViewTemplate
		.querySelector('.card')
		.cloneNode(true) as HTMLElement;

	const productCardPreView = new ProductCardPreView(
		productCardPreViewElement,
		events
	);
	const productData = catalog.getItem(product);

	if (order.hasProduct(product)) {
		productCardPreView.buttonStatus(true);
	}

	events.emit('modal:open', productCardPreView.render(productData));
});

events.on('modal:open', (productEl: HTMLElement) => {
	modal.setContent(productEl).open();
	page.setLocked(true);
});

events.on('modal:close', () => {
	modal.close();
	page.setLocked(false);
});

events.on('basket:open', () => {
	const items: TBascketItem[] = order.items;
	basket.setTotal(order.getTotal());
	let counter = 1;
	if (items.length > 0) {
		basket.listStatus(true);

		basket.list.replaceChildren(
			...items.map((item: TBascketItem) => {
				const cardBasketElement = cardBasketTemplate
					.querySelector('.card')
					.cloneNode(true) as HTMLElement;

				const cardBasketView = new BasketItem(cardBasketElement, events);

				cardBasketView.setCounter(counter);
				counter++;

				const rendered = cardBasketView.render(item);
				return rendered;
			})
		);
	} else {
		basket.listStatus(false);
	}
	events.emit('modal:open', basket.render());
});

events.on('product:addBasket', (productId: TProductId) => {
	const productData = catalog.getItem(productId);
	const basketItem: TBascketItem = {
		id: productData.id,
		title: productData.title,
		price: productData.price,
	};

	if (order.hasProduct(productId)) {
		events.emit('product:removeBasket', productId);
	} else {
		order.addProduct(basketItem);
		page.setBasketCounter(order.items.length);
		basket.setTotal(order.getTotal());
	}
});

events.on('product:removeBasket', (productId: TProductId) => {
	order.removeProduct(productId);
	page.setBasketCounter(order.items.length);
	events.emit('basket:open');
});

events.on('basket:submit', () => {
	order.order.items = order.items.map((item) => item.id);
	order.order.total = order.getTotal();
	events.emit('modal:open', formPayment.render());
});

events.on('order.payment:change', (data: { value: string }) => {
	order.setOrderPayment('payment', data.value);
});

events.on('order.address:change', (data: { value: string }) => {
	order.setOrderPayment('address', data.value);
});

events.on('formErrorsOrder:change', (data: { errors: TFormErrors }) => {
	if (Object.keys(data.errors).length == 0) {
		formPaymentElement.querySelector('.form__errors').textContent = '';

		formPayment.disableButton(
			formPaymentElement.querySelector('.order__button'),
			false
		);
	} else {
		formPaymentElement.querySelector('.form__errors').textContent = Object.keys(
			data.errors
		)
			.map((error: keyof TFormErrors) => data.errors[error])
			.join(', ');

		formPayment.disableButton(
			formPaymentElement.querySelector('.order__button'),
			true
		);
	}
});

events.on('order:submit', () => {
	events.emit('modal:open', formContacts.render());
});

events.on('order.email:change', (data: { value: string }) => {
	order.setOrderContacts('email', data.value);
});

events.on('order.phone:change', (data: { value: string }) => {
	order.setOrderContacts('phone', data.value);
});

events.on('formErrorsContacts:change', (data: { errors: TFormErrors }) => {
	if (Object.keys(data.errors).length == 0) {
		formContactsElement.querySelector('.form__errors').textContent = '';

		formContacts.disableButton(
			formContactsElement.querySelector('.button'),
			false
		);
	} else {
		formContactsElement.querySelector('.form__errors').textContent =
			Object.keys(data.errors)
				.map((error: keyof TFormErrors) => data.errors[error])
				.join(', ');

		formContacts.disableButton(
			formContactsElement.querySelector('.button'),
			true
		);
	}
});

events.on('contacts:submit', () => {
	webLarekApi.orderProduct(order.order);
	events.emit('modal:open', formSuccess.render({ total: order.getTotal() }));
});

// События изменения данных (генерируются классами моделями данных)

// productList:changed - изменение списка карточек товара ✅
// formErrorsOrder:change - изменение состояния валидации формы заказа✅
// formErrorsContacts:change - изменение состояния валидации формы контактов✅
// /^order\..*:change/ - изменение одного из полей формы заказа✅
// /^contacts\..*:change/ - изменение одного из полей формы контактов✅

// События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)

// modal:open - открытие модального окна ✅
// modal:close - закрытие модального окна ✅
// basket:open - открытие модального окна с корзиной ✅
// product:open - открытие модального окна с товаром ✅
// product:addBasket - добавление товара в корзину✅
// product:removeBasket - удаление товара из корзины✅
// basket:submit - добавление товаров из корзины в заказ✅
// order:submit - добавление данных способа оплаты и адреса в заказ
// contacts:submit - добавление данных покупателя в заказ
