import { shop, stock } from "./instance-axios"

export const handleError = (error) => {
    console.error(error);
}


// 카테고리 데이터를 요청하는 함수 - 장고 서버
export function getCategory(endpoint, success, fail) {
    shop.get(`${endpoint}/`).then(success).catch(fail);
}

// 소분류에 해당하는 상품 목록(10개)을 요청하는 함수
export function getProducts(endpoint, success, fail) {
    shop.get(`${endpoint}`).then(success).catch(fail);
}

// 해당 유저의 새로운 주문 요청 -> 주문 테이블에 하나의 인스턴스 추가, manyToMany 테이블에 상품 수 만큼의 인스턴스 자동 생성
export function newOrder(endpoint, params, success, fail) {
    shop.post(`${endpoint}`, JSON.stringify(params)).then(success).catch(fail);
}

export function getOrderItems(endpoint, success, fail) {
    shop.get(`${endpoint}`).then(success).catch(fail);
}

export function getItemDetail(endpoint, success, fail) {
    shop.get(`${endpoint}`).then(success).catch(fail);
}
// 현재 사용자의 재고를 요청하는 함수 - 스프링 서버
// userSeq, sctgSeq를 params로 보내기
// 메인페이지에서 사용 x 
export function getInventory(endpoint, params, success, fail) {
    stock.post(`${endpoint}/`, params).then(success).catch(fail);
}

// 메인 카테고리 버튼을 누르면 해당 유저의 재고 중 해당 카테고리에 포함되는 것만 리스트로 가져오기
export function getItemsByMajorCategory(endpoint, params, success, fail) {
    stock.post(`${endpoint}`, params).then(success).catch(fail);
}


// 현재 사용자의 재고 중 유통기한이 임박한 상품 정보를 요청하는 함수
// 메인페이지 
// userSeq를 params로 보내기
export function getSoonExpired(endpoint, params, success, fail) {
    stock.post(`${endpoint}/`, params).then(success).catch(fail);
}

// 알림창
// 1. 정기배송 남은 일수 가져오기 - 예를 들어 3일 이하로 남은 건만
export function getRegDelivery(endpoint, success, fail) {
    stock.get(`${endpoint}/`).then(success).catch(fail);
}

// 2.장바구니 품목 주문 완료 건에 대한 배송 예정 일정 알려주기


// 스프링 서버에 post요청 보내는 함수 
// 1. 장바구니 테이블에 데이터 추가
// user id(회원식별번호), count(수량), pdt_id(상품 고유번호) 가 json 형식으로 parameter로 전달됨
// const params = {
//     'user_seq': '4',
//     'count': '3',
//     'pdt_id': '4',
// }
export function addProduct(endpoint, params, success, fail) {
    stock.post(`${endpoint}`, JSON.stringify(params)).then(success).catch(fail);
    console.log('장바구니에 상품을 담았습니다.')
}


// 상품 즐겨찾기 요청 보내기
// 재고 테이블 favorite column boolean값 토글하기
// const params = {
//     'user_seq': '1',
//     'pdt_id': '1'
// }
export function toggleFavorite(endpoint, params, success, fail) {
    // stock.post(`${endpoint}`, JSON.stringify(params)).then(success).catch(fail);
    console.log('상품 즐겨찾기');
}

// 현재 사용자의 장바구니 상품 목록 가져오기
export function getCartList(endpoint, success, fail) {
    stock.get(`${endpoint}`).then(success).catch(fail);
    console.log('장바구니 상품 가져오기');
}

// 현재 사용자의 장바구니에서 해당 상품 삭제하기
export function deleteProduct(endpoint, success, fail) {
    stock.delete(`${endpoint}`).then(success).catch(fail);
    console.log('상품 삭제하기');
}

// 장바구니에서 특정 상품의 수량 변경하기
export function updateCount(endpoint, params, success, fail) {
    stock.put(`${endpoint}`, JSON.stringify(params)).then(success).catch(fail);
    console.log('상품 수량 변경하기');
}

// 장바구니에서 주문하기
export function order(endpoint, params, success, fail) {
    shop.post(`${endpoint}`, JSON.stringify(params)).then(success).catch(fail);
    console.log('주문 완료')
}