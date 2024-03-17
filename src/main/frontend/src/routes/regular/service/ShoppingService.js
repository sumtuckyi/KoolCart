import axios from "axios";

const SHOPPING_API_BASE_URL = "http://i10a101.p.ssafy.io:8000/";

class ShoppingService {
  /**
   * 주문을 처리하는 함수
   * @param {Object} orderData - 주문 데이터
   * @returns {Promise} - 주문 처리 결과를 반환하는 Promise
   */
  placeOrder(orderData) {
    return axios.post(`${SHOPPING_API_BASE_URL}api4/order/`, orderData);
  }
}

export default new ShoppingService();
