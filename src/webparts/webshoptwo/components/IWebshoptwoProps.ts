import { IProductItem, IOrderItem, IAddBasket, IOrderRow } from "../../../models/ISPList";

export interface IWebShopProps {
  description: string;

  productItems: IProductItem[];
  orderItems: IOrderItem[];
  addBasket: IAddBasket[];
  totPrice: number;

  newOrder(title, user): Promise<IOrderItem[]>;
  orderRow(productID, orderTitle): Promise<IOrderRow[]>;

}
