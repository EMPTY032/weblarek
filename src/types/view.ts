interface IView {
  element: HTMLElement;
  render(data?: unknown): HTMLElement;
}

interface IViewConstructor {
  new (): IView;
}

class ListView<T> implements IView {
  element: HTMLUListElement;
  constructor(protected ItemView: IViewConstructor) {
    this.element = document.createElement("ul");
  }

  render(data: T[]) {
    if (data)
      this.element.replaceChildren(
        ...data.map((item) => new this.ItemView().render(item))
      );
    return this.element;
  }
}