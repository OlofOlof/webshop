import { sp, Items, Item } from '@pnp/sp';
import { IProductItem, IOrderItem, IOrderRow } from '../models/ISPList';
import { IDataService } from './IService';
import { useReducer } from 'react';

export default class PNPDataService implements IDataService {

  private _listTitle_1 = 'Produkter';
  private _listTitle_2 = 'Ordrar';
  private _listTitle_3 = 'Orderrader';

  constructor(listTitle: string) {
    this._listTitle_1 = this._listTitle_1;
    this._listTitle_2 = this._listTitle_2;
    this._listTitle_3 = this._listTitle_3;

    this.newOrder = this.newOrder.bind(this);
    this.orderRow = this.orderRow.bind(this);

  }

  public getProducts(): Promise<IProductItem[]> {
    return sp.web.lists.getByTitle(this._listTitle_1).items.get().then((result) => {
      let productItemList: IProductItem[] = [];


      result.map((item: any) => {
        productItemList.push({ Id: item.ID, Title: item.Title, Category: item.ECWS_x002e_Category, Price: item.ECWS_x002e_Price, Picture: item.ECWS_x002e_ImageUrl.Url });
      });
      return productItemList;
    });
  }

  public newOrder(title, user): Promise<IOrderItem[]> {

    return sp.web.lists.getByTitle(this._listTitle_2).items.add({
      'Title': title, 'ECWS_x002e_UserId': user.Id, 'ECWS_x002e_Date': new Date(),

    }).then(() => {
      return this.get2();
    });
  }

  public get2(): Promise<IOrderItem[]> {

    return sp.web.lists.getByTitle(this._listTitle_2).items.get().then((result) => {
      let orderItemList: IOrderItem[] = [];
      result.map((item: any) => {

        sp.web.siteUsers.getById(item.ECWS_x002e_UserId).get().then((res) => {
          var userInfo = res;
          let userTitle = userInfo.Title;

          orderItemList.push({ Id: item.ID, Title: item.Title, User: userTitle, Date: item.ECWS_x002e_Date });
        });

      });
      console.log(result);
      console.log(orderItemList);
      return orderItemList;
    });


  }

  public orderRow(productID: number, orderID: number): Promise<IOrderRow[]> {

    return sp.web.lists.getByTitle(this._listTitle_3).items.add({
      'ECWS_x002e_OrderId': orderID, 'ECWS_x002e_ProductId': productID,
    }).then(() => {
      return this.get3();
    });
  }

  public get3(): Promise<IOrderRow[]> {
    return sp.web.lists.getByTitle(this._listTitle_3).items.get().then((result) => {
      let orderRowList: IOrderRow[] = [];
      result.map((item: any) => {



        orderRowList.push({ Id: item.ID, Title: item.Title, product: item.ECWS_x002e_Product, order: item.ECWS_x002e_Order });
      });
      console.log(result);

      return orderRowList;
    });
  }
}
