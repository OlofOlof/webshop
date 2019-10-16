
export interface IAddBasket{
  Id: number;
  Title: string;
  Price: number;
  Category: string;
  Picture: string;
}

export interface productList {
  Title: string;
  Price: number;
  Category: string;
  Picture: string;
  Id: string;

}

export interface IProductItem {
  Id: number;
  Title: string;
  Price: number;
  Category: string;
  Picture: string;
}

export interface orderList {
  Title: string;
  User: string;
  Date: string;
  Id: number;
}

export interface IOrderItem {
  Title: string;
  User: string;
  Date: string;
  Id: number;
}

export interface IOrderRow {
  Title: string;
  order: number;
  product: number;
  Id: number;
}

