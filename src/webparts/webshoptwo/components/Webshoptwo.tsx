import * as React from 'react';
import styles from './Webshoptwo.module.scss';
import { IWebShopProps } from './IWebshoptwoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IProductItem, IOrderItem, IAddBasket } from '../../../models/ISPList';
import { DisplayMode } from '@microsoft/sp-core-library';
import * as $ from 'jquery';
import { number, any } from 'prop-types';
import { View, Site, sp } from '@pnp/sp';
import { SPHttpClient } from '@microsoft/sp-http';
import { CurrentUser } from '@pnp/sp/src/siteusers';
import * as moment from 'moment';


interface IWebShopState {
  addBasket: IAddBasket[];
  productItem: IProductItem[];
  orderItem: IOrderItem[];
  isHidden: [{
    HideShow: boolean;
  }];
  view: boolean;
  totPrice: number;
  hideDialog: boolean;
}


export default class WebShop extends React.Component<IWebShopProps, IWebShopState> {
  constructor(props: IWebShopProps) {
    super(props);

    this.state = {
      productItem: this.props.productItems,
      orderItem: this.props.orderItems,
      addBasket: this.props.addBasket,
      isHidden: [{ HideShow: true }],
      hideDialog: true,
      view: true,
      totPrice: this.props.totPrice,

    };

  }

  public handleClickProduct(i: number) {

    let isHidden = this.state.isHidden;
    isHidden[i].HideShow = !this.state.isHidden[i].HideShow;

    this.setState({
      isHidden: isHidden
    });
  }

  public handleAddBasket(i: number) {

    let addP = this.state.productItem[i];
    this.state.addBasket.push({ Title: addP.Title, Id: addP.Id, Category: addP.Category, Price: addP.Price, Picture: addP.Picture });
    let totPrice = this.state.totPrice;

    totPrice = 0;

    for (let j = 0; j < this.state.addBasket.length; j++) {
      totPrice = totPrice + this.state.addBasket[j].Price;
    }
    this.setState({
      totPrice: totPrice
    });
    console.log(totPrice);
  }

  public handleRemoveBasket(i: number) {
    let totPrice = this.state.totPrice;
    totPrice = totPrice - this.state.addBasket[i].Price;
    this.state.addBasket.splice(i, 1);

    this.setState({
      totPrice: totPrice
    });

    console.log(totPrice);


  }

  public showView() {
    let view = !this.state.view;
    this.setState({
      view: view
    });
  }

  public getUser() {
    return sp.web.currentUser.get().then((id: CurrentUser) => {
      let user = id;

      return user;
    });
  }

  public async sendOrder() {
    let user = await this.getUser();
    let orderTitle = this.state.orderItem.length + '_' + user['Title'];
    let userOrder = this.state.addBasket;

    for (let i = 0; i < userOrder.length; i++) {
      let productID = userOrder[i].Id;

      this.props.newOrder(orderTitle, user)
        .then(updatedList => {
          this.setState({
            orderItem: updatedList
          });
        });
      let orderID = this.state.orderItem[i].Id;

      this.props.orderRow(productID, orderID);
    }
    if (this.state.addBasket.length !== 0) {
      this.state.addBasket.splice(0, this.state.addBasket.length);
      let totPrice = this.state.totPrice;
      totPrice = 0;
      let dialog = this.state.hideDialog;
      dialog = !this.state.hideDialog;

      this.setState({
        totPrice: totPrice,
        hideDialog: dialog
      });

    }
    else { console.log('Varukorgen är tom'); }

  }

  public closeDialog() {
    let dialog = this.state.hideDialog;
    dialog = !this.state.hideDialog;

    this.setState({
      hideDialog: dialog
    });
  }

  public render(): React.ReactElement<IWebShopProps> {

    if (this.state.view) {
      let itemList = this.state.productItem;
      let presentList: JSX.Element[] = [];


      for (let i = 0; i < itemList.length; i++) {

        presentList.push(
          <span onClick={this.handleClickProduct.bind(this, i)} className={styles.boxProduct} key={i}>
            <span>
              <img src={this.state.productItem[i].Picture}></img>
            </span>
            <div className={styles.textBox}>
              <p> {this.state.productItem[i].Title} </p>
              <p> {this.state.productItem[i].Price}kr </p>
            </div>
            <div className={styles.hidden}>
              {!this.state.isHidden[i].HideShow && <div className={styles.addBasket}>
                <button onClick={this.handleAddBasket.bind(this, i)} className={styles.btnHidden}>LÄGG TILL</button></div>}
            </div>
          </span>
        );
        this.state.isHidden.push({ HideShow: true });
      }

      return (
        <div className={styles.webShopTwo}>
          <div className={styles.container}>

            <div className={styles.product}>
              <div className={styles.topper}>
                <div> <h1>SPORT SHOP</h1> </div>
                <div className={styles.order}>
                  <span>ORDERS</span>
                  <span>PRODUKTER</span>
                  <span onClick={this.showView.bind(this)}>VARUKORG</span>
                </div>
              </div>
              <div className={styles.flexProd}>
                {presentList}
              </div>

            </div>
          </div>
        </div>
      );
    }

    else {
      let itemBasket = this.state.addBasket;
      let presentBasket: JSX.Element[] = [];


      if (itemBasket.length === 0) {

        presentBasket.push(
          <div className={styles.emptyBasket}>Din varukorg är tom :(</div>
        );
      }

      else {

        for (let i = 0; i < itemBasket.length; i++) {

          presentBasket.push(
            <span onClick={this.handleClickProduct.bind(this, i)} className={styles.boxProduct}>
              <span>
                <img src={this.state.addBasket[i].Picture}></img>
              </span>
              <div className={styles.textBox}>
                <p> {this.state.addBasket[i].Title} </p>
                <p> {this.state.addBasket[i].Price}kr </p>
              </div>

              <div className={styles.hidden}>
                {!this.state.isHidden[i].HideShow && <div className={styles.addBasket}>
                  <button onClick={this.handleRemoveBasket.bind(this, i)} className={styles.btnHidden}>TA BORT</button></div>}
              </div>
            </span>
          );
        }
      }

      return (
        <div className={styles.webShopTwo}>
          <div className={styles.container}>

            <div className={styles.product}>
              <div className={styles.topper}>
                <div> <h1>SPORT SHOP</h1> </div>
                <div className={styles.order}>
                  <span>ORDERS</span>
                  <span onClick={this.showView.bind(this)}>PRODUKTER</span>
                  <span>VARUKORG</span>
                </div>
              </div>

              <div className={styles.flexProd}>
                {presentBasket}
                <div className={styles.payUp}>
                  <div className={styles.totPrice}>Att betala: {this.state.totPrice}kr</div>
                  <span>
                    <button className={styles.btnPay} onClick={this.sendOrder.bind(this)} >Beställ</button>
                  </span>

                  <div> {!this.state.hideDialog &&
                    <div className={styles.myDialog}>
                      <div>
                        <span className={styles.diaText}>Tack för din beställning!</span>
                        <span className={styles.diaBtn}><button onClick={this.closeDialog.bind(this)}>X</button></span>
                      </div>
                    </div>}
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      );
    }
  }
}
