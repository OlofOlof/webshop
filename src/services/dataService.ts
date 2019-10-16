import { IProductItem, IOrderItem, IOrderRow } from '../models/ISPList';
import { IDataService } from './IService';

export default class MockDataService implements IDataService  {

    private _items: IProductItem[];
    private _items2: IOrderItem[];
    private _items3: IOrderRow[];

    public constructor() {
      this._items = [{ Id: 1, Title: 'Boll ', Category: 'Sport', Price: 99, Picture:'blabla;#bild' },
                     { Id: 2, Title: 'Hammare ', Category: 'Verktyg', Price: 59, Picture:'blabla;#bild' },
                     { Id: 3, Title: 'Tröja ', Category: 'Textil', Price: 299, Picture:'blabla;#bild'  }
      ];

      this._items2 = [{ Id: 1, Title: 'Boll ', User:'bfbbw', Date: '99'},
                      { Id: 1, Title: 'Boll ', User:'bfbbw', Date: '99'},
                      { Id: 1, Title: 'Boll ', User:'bfbbw', Date: '99'}
      ];

      this.getProducts = this.getProducts.bind(this);
      this.newOrder = this.newOrder.bind(this);
    }


    public getProducts(): Promise<IProductItem[]> {
        return new Promise<IProductItem[]>((resolve) => {
            resolve(this._items);
        });
    }


    public newOrder(title, user) : Promise<IOrderItem[]> {

      return new Promise<IOrderItem[]>((resolve) => {
        return resolve(this._items2);
      });
    }

    public get2(): Promise<IOrderItem[]> {
        return new Promise<IOrderItem[]>((resolve) => {
            resolve(this._items2);
        });
    }

    public orderRow(productID, orderTitle) : Promise<IOrderRow[]> {
      return new Promise<IOrderRow[]>((resolve) => {
        resolve(this._items3);
    });
    }
}
