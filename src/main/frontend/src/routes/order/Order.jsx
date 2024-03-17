import { useEffect, useState, useRef } from "react";
import styled from 'styled-components';
import { addProduct, getCategory, getProducts } from "../../api/getData";
import './Order.css'
import { Menu, Avatar, Card, message } from 'antd';

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../redux/dataSlice";
import ProductComponent from "../regular/ProductComponent";
import MenuComponent from "../regular/MenuComponent";
import Box from '@mui/material/Box';
import { handleError } from "../../api/getData";
import { setItems } from "../../redux/cartSlice";
import { getCartList } from "../../api/getData";

function getItem(label, key, icon, children, type) {
	return {
		key,
		icon,
		children,
		label,
		type,
	};
}

const { Meta } = Card;

export default function Order() {

	const [category, SetCategory] = useState([]);
	const [productsList, SetProductsList] = useState(null)

	const userSeq = useSelector((state) => state.user.userSeq);
	console.log(userSeq)
	const dispatch = useDispatch();

	const info = () => {
        message.info('장바구니에 상품이 추가되었습니다.');
    };

	// store에서 데이터 가져오기
	const categoryData = useSelector((state) => state.data.category);

	useEffect(() => {
		SetCategory(categoryData);
	}, [])

	// 장바구니에 해당 상품을 추가하는 함수
	const handleAddToCart = (item) => {
		addProduct(
			'api/carts/',
			{
				'userSeq': userSeq,
				'pdtSeq': `${item.id}`,
				'count': 1,
				'name': `${item.item}`,
				'imgUrl': `${item.img_url}`,
				'price': `${item.price}`
			},
			(res) => {
				console.log(res)
				// alert('장바구니에 상품이 추가되었습니다.')
				info()
				getCartList(
					`api/carts/products/${userSeq}`,
					({ data }) => {
						console.log(data)
						dispatch(setItems.setItems(data))
					},
					handleError
				)
			},
			(error) => {
				console.error(error)
			}
		)
	}

	// 카테고리 변경시마다 스크롤 위치 맨 위로 이동시키기
	const scrollRef = useRef(null);
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = 0;
		}
	}, [productsList])


	// 소분류 카테고리 인덱스를 받아서 해당 상품 목록을 요청(10개-30개)
	function showProducts(idx) {
		getProducts(
			`api4/pdt_list/${idx}`,
			({ data }) => {
				console.log(data);
				SetProductsList(data)
			},
			(error) => {
				console.error(error);
			}
		)
	}

	const items2 = []
	let idx = 1;
	category.map((item, i) => {
		const smallCate = item.small_categories.map((sItem) => {
			return getItem(sItem.name, idx++, null, null);
		});
		console.log(smallCate)
		items2.push(getItem(item.name, `cate${i}`, null, smallCate));
	}
	)

	return (
		<Box 
			sx={{
				height: '83vh',
				marginLeft: '200px',
				// bgcolor: 'background.paper',
				p : 1
			}}
		>
			<MenuComponent
				color='#EFEFEF'
				handleAdd={handleAddToCart}
			/>
		</Box>
	)
}

