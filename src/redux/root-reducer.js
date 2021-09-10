import {combineReducers} from 'redux';
import AlertsReducer from './alerts/alerts.reducer';
import UserReducer from './user/user.reducer';
import PurchasedItemsReducer from './purchased-items/purchased-items.reducer';
import MyCommentsReducer from './my-comments/my-comments.reducer';
import ProductsReducer from './products/products.reducer';
import ProductDetailReducer from './product-detail/product-detail.reducer';
import PurchaseSeatsReducer from './purchase-seats/purchase-seats.reducer';
import FaqItemsReducer from './faq-items/faq-items.reducer';
import OthersReducer from './others/others.reducer';
import ColorsReducer from './colors/colors.reducer';

export default combineReducers({
    alerts: AlertsReducer,
    user: UserReducer,
    purchasedItems: PurchasedItemsReducer,
    myComments: MyCommentsReducer,
    products: ProductsReducer,
    product_detail: ProductDetailReducer,
    purchaseSeats: PurchaseSeatsReducer,
    faq_items: FaqItemsReducer,
    colors: ColorsReducer,
    others: OthersReducer
});