import axios from 'axios'
import { Divider } from 'antd';
import Message from './Message';
import { getCategory, getItemsByMajorCategory, handleError } from '../../api/getData';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Component, ExpComponent } from './Carousel';
import { setCategory } from '../../redux/dataSlice';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Inventory } from './Inventory';

import './Home.css';

const move = keyframes`
  from {
    transform: translate(-100px, -50px) rotate(-90deg);
    border-radius: 24% 76% 35% 65% / 27% 36% 64% 73%;
  }

  to {
    transform: translate(500px, 100px) rotate(-10deg);
    border-radius: 76% 24% 33% 67% / 68% 55% 45% 32%;
  }
`;

const Blob = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  background: linear-gradient(
    180deg,
    rgba(47, 184, 255,0.42) 31.77%,
    #5c9df1 100%
  );
  mix-blend-mode: color-dodge;
  animation: ${move} 25s infinite alternate;
  transition: 1s cubic-bezier(0.07, 0.8, 0.16, 1);

  &:hover {
    width: 520px;
    height: 520px;
    filter: blur(30px);
    box-shadow:
      inset 0 0 0 5px rgba(255,255,255, 0.6),
      inset 100px 100px 0 0px #fa709a,
      inset 200px 200px 0 0px #784ba8,
      inset 300px 300px 0 0px #2b86c5;
  }
`;

const PageContainer = styled.div`
	padding-left: 200px;
`;

const MsgContainer = styled.div`
	position: relative;
	width: 800px;
	height: 500px;
	border-radius: 5px;
	margin: 20px;
	padding: 10px;
	background-color: rgba(255, 255, 255, 0.3);
	box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.25);
	overflow-y: scroll;
	&::-webkit-scrollbar {
		display: none;
	}
`;

const Container = styled.div`
	position: absolute;  
  width: 100%;  
  height: 100%;  
  overflow: hidden;
`;

export default function Home() {

	// 메인화면 진입 시 , 유저 정보 받아오기
	const dispatch = useDispatch();
	const userSeq = useSelector((state) => state.user.userSeq);
	console.log(userSeq)

	// 사용자가 메인화면 진입 시, 쇼핑몰 서버로부터 카테고리 데이터 받아와서 스토어에 저장
	useEffect(() => {
		getCategory(
			'api4/category',
			({ data }) => {
				console.log(data)
				// SetCategory(data) // 받아온 데이터를 저장
				// Dispatch the action to update the category data in the Redux store
				dispatch(setCategory(data));
			},
			(error) => {
				console.error(error);
			}
		); // 쇼핑몰 카테고리 가져오기
	}, [dispatch])

	const [products, SetProducts] = useState(null);
	const [soonExpiredProducts, SetSoonExpiredProducts] = useState(null);
	const [messages, SetMessages] = useState(null); // 일반배송 알림
	const [cateKey, SetCateKey] = useState(null);
	let filteredMessages = [];

	useEffect(() => {
		if (userSeq !== null) {
			showAllFavorites()
		} else {
			alert('먼저 로그인해주세요.')
		}
	}, []); // 홈화면 최초 렌더링 시 유저가 즐겨찾기한 재고 품목 가져오기 

	const showAllFavorites = () => {
		SetCateKey(0)
		axios.post('/api/stock/total/favorite',
			{
				user_seq: userSeq,
			})
			.then(response => {
				SetProducts(response.data)
				console.log(response.data)
				console.log('새로고침!', products)
			});
	} // 해당 유저의 즐겨찾기 품목 모두 가져오기

	const showAllExpired = () => {
		axios.post('/api/stock/total/exp',
			{
				user_seq: userSeq,
			},
		)
			.then(response => {
				SetSoonExpiredProducts(response.data)
				console.log('유통기한 재고:', response.data)
			});
	} // 해당 유저의 유통기한 만료/임박 품목 모두 가져오기

	const handleFiltering = (key) => {
		SetCateKey(key)
		if (key === 0) {
			console.log('전체보기')
			showAllFavorites()
		} else {
			axios.post('/api/stock/mctg',
				{
					user_seq: userSeq,
					mctg_seq: key,
				},
			).then(response => {
				SetProducts(response.data)
				console.log('products:', response.data)
			});
		}
	} // 즐겨찾기한 품목 중 대분류(mctg_idx)를 기준으로 필터링하여 가져오기

	const handleFilteringToggle = (key) => {
		axios.post('/api/stock/mctg',
			{
				user_seq: userSeq,
				mctg_seq: key,
			},
		).then(response => {
			SetProducts(response.data)
			console.log('products:', response.data)
		});
	} // 즐겨찾기 토글 시 현재 선택된 카테고리(key)리스트 새로 가져오기

	const handleFilteringExpToggle = (key) => {
		axios.post('/api/stock/detail/mctg/exp',
			{
				user_seq: userSeq,
				mctg_seq: key,
			},
		)
			.then(response => {
				SetSoonExpiredProducts(response.data)
				console.log(response.data)
			})
	} // 즐겨찾기 토글 시 업데이트

	const handleExpFiltering = (key) => {
		SetCateKey(key)
		if (key === 0) {
			showAllExpired()
		} else {
			axios.post('/api/stock/detail/mctg/exp',
				{
					user_seq: userSeq,
					mctg_seq: key,
				},
			)
				.then(response => {
					SetSoonExpiredProducts(response.data)
					console.log(response.data)
				})
		}
	} // 유통기한 임박 상품을 카테고리별로 보여주기

	const getMessages = () => {
		axios.post('/api/message/listAll',
			{
				user_seq: userSeq,
			})
			.then((res) => {
				console.log('알림 메세지: ', res)
				SetMessages(res.data)
				filteredMessages = res?.data.filter(msg => msg.alarmCategory === 1)
				console.log('일반배송 알림만: ', filteredMessages)
			}
			)
	} // 유저의 배송알림 데이터 가져오기 - orderId가 있는 알림으로만

	useEffect(() => {
		if (userSeq !== null) {
			console.log('userSeq:', userSeq)
			getMessages()
			axios.post('/api/stock/total/exp',
				{
					user_seq: userSeq,
				},
			)
				.then(response => {
					SetSoonExpiredProducts(response.data)
					console.log('유통기한 재고:', response.data)
				});
		}
	}, []) // 홈화면 최초 렌더링 시 해당 유저의 재고 중 유통기한이 3일 이하인 품목만 보여주기


	return (
		<>
			<PageContainer>
				{/* 재고 보여주기 - carousel
				sctg_seq별로 볼 수 있게하기 
				즐겨찾기 버튼을 누르면 해당 pdt_seq를 가진 재고의 favoirte을 반대로 토글 */}
				{!userSeq ? (
					<>
						<p>먼저 로그인하세요.</p>
					</>
				) : (
					<>
						{products && soonExpiredProducts && (
							<>
								<Container>
									<Blob></Blob>
								</Container>
								<Inventory
									array={products}
									handleClick={handleFiltering}
									text="해당 카테고리의 즐겨찾기 품목이 없습니다."
									showAll={showAllFavorites}
									cateKey={cateKey}
									func={handleFiltering}
									tof={true}
								/>
								{/* <Component
									array={products}
									handleClick={handleFiltering}
									text="해당 카테고리의 즐겨찾기 품목이 없습니다."
									showAll={showAllFavorites}
									cateKey={cateKey}
									func={handleFilteringToggle}
									tof={true}
								/> */}
								{/* 알림 메시지 보여주기 */}
								<MsgContainer>
									<Divider orientation="left">일반배송 알림</Divider>
									{
										messages?.filter(msg => msg.alarmCategory == 1).map((msg, i) => {
											return (
												<Message
													key={i}
													orderId={msg.orderId}
													orderDate={msg.logTime}
													user={userSeq}
													alarmId={msg.alarmId}
													func={getMessages}
												/>
											)
										})
									}
									<Divider orientation="left">정기배송 알림</Divider>
									{
										messages?.filter(msg => msg.alarmCategory == 2).map((msg, i) => {
											return (
												<Message
													key={i}
													orderId={msg.orderId}
													orderDate={msg.logTime}
													user={userSeq}
													alarmId={msg.alarmId}
													func={getMessages}
												/>
											)
										})
									}
									{/* <Message text="[제주 삼다수]생수 (2L X 6개)의 정기배송이 3일 남았습니다." /> */}
									{/* <Divider orientation="left">유통기한 알림</Divider>
								<Message text="사과 소비기한이 3일 남았습니다." /> */}
								</MsgContainer>
								<Container>
									<Blob></Blob>
								</Container>
								{/* 재고 중에서 유통기한 초과 또는 임박 상품 보여주기 - 초과 / 임박 기준은 3일?*/}
								{/* <Component
									array={soonExpiredProducts}
									handleClick={handleExpFiltering}
									text="해당 카테고리의 유통기한 만료/임박 상품이 없습니다."
									showAll={showAllExpired}
									cateKey={cateKey}
									func={handleFilteringExpToggle}
									tof={false}
								/> */}
								<Inventory
									array={soonExpiredProducts}
									handleClick={handleExpFiltering}
									text="해당 카테고리의 유통기한 만료/임박 상품이 없습니다."
									showAll={showAllExpired}
									cateKey={cateKey}
									func={handleFilteringExpToggle}
									tof={false}
								/>
								<Blob></Blob>
							</>
						)}
					</>
				)}
			</PageContainer>
		</>
	)
}