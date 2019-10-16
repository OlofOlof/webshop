// import { IProductItem } from '../models/ISPList';
// import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
// import { IDataService } from './IService';

// export default class SPDataService implements IDataService  {

//     private _httpClient: SPHttpClient;
//     private _url: string;
//     private _listTitle: string;

//     public constructor(httpClient: SPHttpClient, url: string, listTitle: string) {
//       this._httpClient = httpClient;
//       this._url = url;
//       this._listTitle = listTitle;

//       this.getProducts = this.getProducts.bind(this);
//     }

//     public async getProducts(id: number) : Promise<IProductItem[]> {

//         let etag: string = undefined;
//         let selectData = '?$select=Id,ECWS_x002e_Category,ECWS_x002e_Price,ECWS_x002e_';

//         const response = await this._httpClient.get(`${this._url}/_api/web/lists/getbytitle,
//         ('${this._listTitle}')/items(${id})${selectData}`, 
//         SPHttpClient.configurations.v1, {
//         headers: {
//           'Accept': 'application/json;odata=nometadata',
//           'odata-version': ''
//         }
//       });
//       etag = response.headers.get('ETag');
//       const item = await response.json();
//       const body: string = JSON.stringify({
//         '__metadata': {
//           'type': 'SP.Data.' + this._listTitle + 'ListItem'
//         }
//       });
//       await this._httpClient.post(`${this._url}/_api/web/lists/getbytitle('${this._listTitle}')/items(${id})`, SPHttpClient.configurations.v1, {
//         headers: {
//           'Accept': 'application/json;odata=nometadata',
//           'Content-type': 'application/json;odata=verbose',
//           'odata-version': '',
//           'IF-MATCH': etag,
//           'X-HTTP-Method': 'MERGE'
//         },
//         body: body
//       });
//       return this.get();

//     }

//     public get(): Promise<IProductItem[]> {
//       return this._httpClient.get(this._url + `/_api/web/lists/getbytitle('${this._listTitle}')/items`, SPHttpClient.configurations.v1)
//       .then((response: SPHttpClientResponse) => {

//         return response.json()
//           .then(jsonResult => {
//             let listItem: IProductItem[] = jsonResult.value.map(item => {
//               return { Id: item.ID, Title: item.Title, Category: item.ECWS_x002e_Category, Price: item.ECWS_x002e_Price, Picture: item.ECWS_x002e_ImageUrl.Url };
              
//             });
//             console.log(listItem);
//             return listItem;
//           });
//       });
//     }
// }
