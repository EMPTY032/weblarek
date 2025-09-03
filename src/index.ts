import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { Catalog, Order, TBascketItem, TProductId } from './types/model';
import { WebLarekApi } from './types/presenter';
import {
	Basket,
	BasketItem,
	Modal,
	Page,
	ProductCardPreView,
	ProductCardView,
} from './types/view';
import { IProduct } from './types/webApi';
import { API_URL } from './utils/constants';

const cardTemplate =
	document.querySelector<HTMLTemplateElement>('#card-catalog').content;
const productCardPreViewTemplate =
	document.querySelector<HTMLTemplateElement>('#card-preview').content;
const basketTemolate =
	document.querySelector<HTMLTemplateElement>('#basket').content;
const cardBasketTemplate =
	document.querySelector<HTMLTemplateElement>('#card-basket').content;

const pageElement = document.querySelector('.page') as HTMLElement;
const modalElement = document.querySelector('.modal') as HTMLElement;
const productCardPreViewElement = productCardPreViewTemplate.querySelector(
	'.card'
) as HTMLElement;
const basketElemnt = basketTemolate.querySelector('.basket') as HTMLElement;

const api = new Api(API_URL);
const events = new EventEmitter();
const webLarekApi = new WebLarekApi(api);
const catalog = new Catalog(events);
const page = new Page(pageElement, events);
const modal = new Modal(modalElement, events);
const basket = new Basket(basketElemnt, events);
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
	const productCardPreView = new ProductCardPreView(
		productCardPreViewElement,
		events
	);
	const productData = catalog.getItem(product);

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
	console.log(items);
	if (items.length > 0) {
		basket.list.replaceChildren(
			...items.map((item: TBascketItem) => {
				const cardBasketElement = cardBasketTemplate
					.querySelector('.card')
					.cloneNode(true) as HTMLElement;
				const cardBasketView = new BasketItem(cardBasketElement, events);
				const rendered = cardBasketView.render(item);
				return rendered;
			})
		);
	} else {
		basket.list.textContent = 'пусто тут)';
	}
	events.emit('modal:open', basket.render());
});

events.on('product:addBasket', (product: TProductId) => {
	const productData = catalog.getItem(product);
	const basketItem: TBascketItem = {
		id: productData.id,
		title: productData.title,
		price: productData.price,
	};
	order.addProduct(basketItem);
});

// События изменения данных (генерируются классами моделями данных)

// productList:changed - изменение списка карточек товара ✅
// formErrorsOrder:change - изменение состояния валидации формы заказа
// formErrorsContacts:change - изменение состояния валидации формы контактов
// /^order\..*:change/ - изменение одного из полей формы заказа
// /^contacts\..*:change/ - изменение одного из полей формы контактов
// totalUpdated - обновление суммы заказа
// order:ready - поля формы заказа валидны
// contacts:ready - поля формы контактов валидны

// События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)

// modal:open - открытие модального окна ✅
// modal:close - закрытие модального окна ✅
// basket:open - открытие модального окна с корзиной ✅
// product:open - открытие модального окна с товаром ✅
// product:addBasket - добавление товара в корзину
// product:removeBasket - удаление товара из корзины
// basket:submit - добавление товаров из корзины в заказ
// order:submit - добавление данных способа оплаты и адреса в заказ
// contacts:submit - добавление данных покупателя в заказ
