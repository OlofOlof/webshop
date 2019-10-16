import { IProductItem, IOrderItem, IOrderRow } from "../models/ISPList";

export interface IDataService {
  getProducts(): Promise<IProductItem[]>;
  get2(): Promise<IOrderItem[]>;
  newOrder(title, user) : Promise<IOrderItem[]>;
  orderRow(productID, orderTitle) : Promise<IOrderRow[]>;

}
