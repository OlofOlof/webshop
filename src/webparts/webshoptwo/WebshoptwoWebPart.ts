import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'WebshoptwoWebPartStrings';
import WebShop from './components/Webshoptwo';
import { IWebShopProps } from './components/IWebshoptwoProps';
// import SPDataService from '../../services/spDataService';

import { sp } from "@pnp/sp";
import PNPDataService from '../../services/pnpDataService';
import { IDataService } from '../../services/IService';
import MockDataService from '../../services/dataService';
import { CurrentUser } from '@pnp/sp/src/siteusers';

export interface IWebShopWebPartProps {
  productItems2: any;
  description: string;
  listTitle: string;
  totPrice: number;
}

export default class WebShopWebPart extends BaseClientSideWebPart<IWebShopWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    let service: IDataService;

    if (Environment.type === EnvironmentType.Local) {
      service = new MockDataService();
    }
    else {
      {
        service = new PNPDataService(this.properties.listTitle);
      }
    }

    service.getProducts()

      .then(products => {

        service.get2()
          .then(orders => {

            // Skapa upp react-komponenten och skicka med de props som behövs
            const element: React.ReactElement<IWebShopProps> = React.createElement(
              WebShop,
              {
                totPrice: this.properties.totPrice,
                description: this.properties.description,
                productItems: products,
                orderItems: orders,
                addBasket: [],

                newOrder: service.newOrder,
                orderRow: service.orderRow
              }
            );

            ReactDom.render(element, this.domElement);
          });
      });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listTitle', {
                  label: 'List Title'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
