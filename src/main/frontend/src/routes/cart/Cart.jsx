import { useEffect, useState } from "react"
import { getCartList, deleteProduct, updateCount, handleError, order } from "../../api/getData";
import { useSelector } from "react-redux";
import './Cart.css';
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setItems } from "../../redux/cartSlice";
import { Checkbox, message } from 'antd';
import { Button } from "@nextui-org/react";
import { ItemName, ItemPrice } from "../../styles/ItemStyles";
import axios from "axios";
import Modal from "./Modal";

const PageContainer = styled.div`
	padding-left: 200px;
	height: 1280px;
`;

const StyledCheckbox = styled(Checkbox)`
	display: flex;
  align-items: center;
  .ant-checkbox-inner {
    width: 30px;
    height: 30px;
		margin: 5px;
  }
  .ant-checkbox-inner::after {
		width: 14px;
    height: 14px;
    left: 35%;
    top: 50%;
  }
`;



export default function CartPage() {

	const [productsInCart, SetProductsInCart] = useState(null);
	const [totalSum, setTotalSum] = useState(null);
	const userSeq = useSelector((state) => state.user.userSeq);
	console.log(userSeq)
	const dispatch = useDispatch();

	const success = () => {
		const formattedPrice = totalSelectedSum.toLocaleString();
		message.success(<>주문이 완료되었습니다.<br />총 주문 금액 {formattedPrice}원</>);
	};

	const info = () => {
		message.info('먼저 주문할 상품을 선택해주세요.')
	}

	// 장바구니 상품 전체선택 및 해제 토글
	const [checkedList, setCheckedList] = useState([]);
	const checkAll = productsInCart?.length === checkedList?.length;
	const indeterminate = checkedList?.length > 0 && checkedList?.length < productsInCart.length;
	const onCheckAllChange = (e) => {
		setCheckedList(e.target.checked ? productsInCart.map(product => product.cartSeq) : []);
		SetProductsInCart(productsInCart.map(product => ({ ...product, selected: e.target.checked })));
	};
	const [totalChecked, SetTotalChecked] = useState(null) // 총선택된 품목의 개수
	const [totalSelectedSum, setTotalSelectedSum] = useState(0) // 선택된 품목 주문 금액

	useEffect(() => {
		let selected = productsInCart === null ? 0 : productsInCart.filter(item => item.selected === true).length;
		SetTotalChecked(selected) // productsInCart 배열에서 selected속성이 true인 항목만 카운트
		updateSelectedSum(productsInCart)
	}, [productsInCart]) // 선택된 항목의 개수, 금액 업데이트


	const updateTotalSum = (productsInCart) => {
		const sum = productsInCart?.reduce((accumulator, currentValue) => {
			const numericPrice = parseFloat(currentValue.price.replace(/[^\d.]/g, ''));
			const count = currentValue.count;

			if (!isNaN(numericPrice)) {
				return (accumulator + numericPrice * count);
			} else {
				return accumulator;
			}
		}, 0)
		setTotalSum(sum)
	}

	const updateSelectedSum = (productsInCart) => {
		const sum = productsInCart?.filter(item => item.selected === true)?.reduce((accumulator, cur) => {
			const numericPrice = parseFloat(cur.price.replace(/[^\d.]/g, ''))
			const count = cur.count;

			if (!isNaN(numericPrice)) {
				return (accumulator + numericPrice * count);
			} else {
				return accumulator;
			}
		}, 0)
		setTotalSelectedSum(sum)
	} // 선택된 항목의 금액 계산하기

	useEffect(() => {
		if (userSeq !== null) { // 로그인 된 경우에만 해당 유저 장바구니 가져오기
			console.log(userSeq)
			axios.get(
				`/api/carts/products/${userSeq}`)
				.then(
					({ data }) => {
						console.log(data)
						SetProductsInCart(data)
						updateTotalSum(data)
					}
				)
		} else {
			alert('로그인하세요');
		}
	}, []) // 장바구니 데이터 가져오기

	const handleDelete = (idx) => {
		deleteProduct(
			`/api/carts/${idx}`,
			(res) => {
				console.log(res);
				getCartList(
					`/api/carts/products/${userSeq}`,
					({ data }) => {
						console.log(data)
						SetProductsInCart(data)
						updateTotalSum(data)
						dispatch(setItems.setItems(data))
					},
					handleError
				)
			},
			handleError
		)
	} // 장바구니 항목 삭제하기 

	const handleCount = (value, item) => {
		if (value == '+') {
			const newCount = ++item.count;
			updateCount('/api/carts/',
				{
					"userSeq": userSeq,
					"cartSeq": item.cartSeq,
					"count": newCount
				},
				(res) => {
					console.log(res);
					getCartList(
						`/api/carts/products/${userSeq}`,
						({ data }) => {
							console.log(data)
							SetProductsInCart(data)
							updateTotalSum(data)
						},
						handleError
					)
				},
				handleError
			)// item의 카운트 값을 +1, put요청 보내기
		} else {
			// 원래 카운트가 1인 경우는 '-'버튼을 비활성화
			const newCount = --item.count;
			updateCount('/api/carts/',
				{
					"userSeq": userSeq,
					"cartSeq": item.cartSeq,
					"count": newCount
				},
				(res) => {
					console.log(res);
					getCartList(
						`/api/carts/products/${userSeq}`,
						({ data }) => {
							console.log(data)
							SetProductsInCart(data)
							updateTotalSum(data)
						},
						handleError
					)
				},
				handleError
			)
		} // item의 카운트 값을 -1, put요청 보내기 
	}
	// 장바구니 품목 카운트 정보 변경하기 

	const handleOrder = async () => {

		const selectedProducts = productsInCart.filter((item) => item.selected); // 체크박스로 선택한 상품 리스트
		// 선택한 상품의 고유 인덱스와 장바구니 테이블에서의 고유 인덱스를 저장
		const pdtList = selectedProducts.map((item) => {
			return {
				pdt_id: item.pdtSeq,
				count: item.count,
			}
		})

		const cartSeqList = selectedProducts.map((item) => item.cartSeq);

		// 선택된 상품이 없는 경우에는 주문이 되지 않게 하기
		if (selectedProducts.length !== 0) {
			// 상품 주문 - 쇼핑몰 서버 post -> delete요청 -> 새로 장바구니 페이지 갱신
			order(
				'api4/order/',
				{
					'user': userSeq,
					'pdts': JSON.stringify(pdtList),
					'standard': 1,
				},
				(res) => {
					console.log(res);
					success()
					// alert('주문이 완료되었습니다.');
				},
				handleError,
			)

			cartSeqList.map((item) => {
				deleteProduct(
					`/api/carts/${item}`,
					(res) => {
						console.log(res);
						getCartList(
							`/api/carts/products/${userSeq}`,
							({ data }) => {
								console.log(data)
								SetProductsInCart(data)
								updateTotalSum(data)
								dispatch(setItems.setItems(data))
							},
							handleError
						)
					},
					handleError
				)
			})
		} else {
			// alert('먼저 주문할 상품을 선택해주세요.');
			info()
		}
	} // 장바구니에 있는 품목 주문하기 -> 주문 완료창 띄워주고, 장바구니 비우기

	const handleCheckboxChange = (cartSeq) => {
		SetProductsInCart((prev) => // 장바구니에 있는 상품 배열을 받아서 선택된 항목만 그 속성(selected)을 토글 
			prev.map((item) =>
				item.cartSeq === cartSeq
					? { ...item, selected: !item.selected }
					: item
			)
		);
	} // 체크박스를 클릭하면 호출됨, 클릭된 상품의 장바구니 테이블에서의 고유번호를 받는다.

	return (
		<PageContainer>
			<div className="cart-container">
				<div id="cart-order">
					{/* <h3>총 {productsInCart?.length}개의 품목이 있습니다.</h3> */}
					<StyledCheckbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
						Check all ({totalChecked}/{productsInCart?.length})
					</StyledCheckbox>
					<p>총 {totalSum?.toLocaleString()}원</p>
					<Button onClick={() => handleOrder()}>주문하기</Button>
				</div>
				<ul>
					{productsInCart && productsInCart.length > 0 ? (
						productsInCart.map((item, i) => (
							<div id="cart-card" key={i}>
								<StyledCheckbox
									type="checkbox"
									checked={item.selected || false}
									onChange={() => handleCheckboxChange(item.cartSeq)}
								/>
								<img src={item.imgUrl} alt="img" />
								<div id="cart-card-text">
									<div id="cart-card-text-info">
										<ItemName>{item.name}</ItemName>
										<ItemPrice>{(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.count)?.toLocaleString()}원</ItemPrice>
										<div id="cart-card-count">
											<button
												onClick={() => handleCount('-', item)}
												disabled={item.count === 1}
											>
												-
											</button>
											<p>{item.count}</p>
											<button onClick={() => handleCount('+', item)}>+</button>
										</div>
									</div>
									<button
										id="delete-btn"
										onClick={() => handleDelete(item.cartSeq)}
									>
										X
									</button>
								</div>
							</div>
						))
					) : (
						<Modal
							text="장바구니에 아직 상품이 없어요."
							buttonText="장보기"
						/>
					)
					}
				</ul>
			</div>
		</PageContainer>
	)
}