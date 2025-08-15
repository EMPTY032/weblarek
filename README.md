# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


Архитектура проекта «Веб-ларёк»
Введение

Проект реализует веб магазин для отображения товаров, добавления их в корзину и оформления заказов. Основная цель - создать модульную архитектуру, разделяющую бизнес логику, представление и управление состоянием через события.

1. Базовый классы

1) Класс Api
Делает запросы к серверу и упрощает работу с апи. При создании экземпляра класса принимает в конструктор базовую ссылку и опции к запросу.
Имеет защищеный метод handleResponse(response: Response): Promise<object>, который проверяет на коректность ответ принимая его в себя и возвращаю промис С дженериком объекта
Также имеет публичные методы get и post реализующие запрос и отправку данных соответственно

2) Класс EventEmitter
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
Класс имеет методы on, off, emit - для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
Дополнительно реализованы методы  onAll и  offAll - для подписки на все события и сброса всех
подписчиков.
Интересным дополнением является метод  trigger , генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
классы будут генерировать события, не будучи при этом напрямую зависимыми от
класса  EventEmitter .

2. Компоненты модели данных (бизнес-логика)

1) Класс CatalogModel
Содержит список с экземплярами класса Product. Имеет такие функции, как setItems(items: T[]): void - заполнить католог массивом, getItem(id: string): T - для получения элемента по id

interface ICatalogModel{
    items: Product[];

    setItems(items: Product[]): void;
    getItem(id: string): IProduct
}

2) Класс BasketModel 
Содержит список о товарах добавленных в корзину, а также функции для добавления товара, удаления товара, полной очистки списка и запрос к товару по id
export interface IBasketModel{
    items: IProduct[]

    add(id: string): void
    remove(id: string): void
    allRemove(): void
    getItem(id: string): IProduct
}


3) Класс FormModel
Содержит информацию о заказе(IOrder), функции для заполнения этой информации и очистки её же
export interface IFormModel{
    orderObject: IOrder

    setPaymentAndAddress(payment: string, address: string): void
    setContacts(email: string, phone: string): void
    allRemove(): void
}

3. Компоненты представления

Класс ProductView для отображения продукта

Класс ProductListView для отображения списка содержащего в себе продукты

Класс BusketListView для отображения списка в корзине

Класс ModalView для отображения модальных окон на сайте
Принимает HTMLElement при запросе к нему и имеет функции закрытия(close()) и открытия(open()) окна


4. Ключевые типы данных

продукт
interface IProduct{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

оплата
interface IOrder{
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: Product[];
}

ответ сервера при оплате
interface OrderResult{
    id: string;
    total: number
}

интерфейс для работы с Апи
export interface IWebApi{
    productList: () => Promise<Product[]>;
    produtItem: (id: string) => Promise<Product>
    orderProduct: (order: Order) => Promise<OrderResult>
}