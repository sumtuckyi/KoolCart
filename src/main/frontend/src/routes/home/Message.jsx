import React, { useEffect, useState } from 'react';
import { Collapse, Divider, Button } from 'antd';
import axios from 'axios';
import { getOrderItems, handleError, getItemDetail } from '../../api/getData';
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';

const MessageContainer = styled.div`
  margind-left: 15px;
`
const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
`
const StyledP = styled.p`
  font-size: 25px;
  margin-bottom: 10px;
`

// orderId가 주문 고유번호, orderDate는 주문 일자, user는 고객 번호, func는 메세지를 db로부터 새로 가져오는 함수
export default function Message({ orderId, orderDate, user, alarmId, func }) {

  const userSeq = useSelector((state) => state.user.userSeq);
  
  const [orderData, SetOrderData] = useState(null)
  const [count, Setcount] = useState(null)
  const [products, setProducts] = useState([]);

  let postData = []

  const addItems = async () => {
    postData = products.map((item) => ({
      user_seq: userSeq,
      sctg_seq: item.small_cate,
      pdt_seq: item.product,
      name: item.name,
      count: item.quantity,
    }));
    await axios.post('api/stock/message/add', postData)
  } // 메세지 확인 클릭 시, 해당 주문 건의 상품을 재고에 추가하는 요청 보내기

  const handleConfirm = async (alarmId) => {
    console.log('메세지 확인, 해당 배송건 상품을 재고에 추가', alarmId)
    await addItems()
    await axios.post('api/message/check',
      {
        user_seq: user,
        ms_seq: alarmId,
      })
      .then((res) => {
        console.log(res);
        func()
        // 업데이트된 메세지 가져오기 
      })
    handleOrderData(orderId)
  } // 홈화면에서 배송완료 메세지를 확인하면 자동으로 재고가 추가됨 + 해당 알림은 읽은 것으로 체크

  const handleOrderData = async (orderID) => {
    console.log('주문 고유번호: ', orderID)
    // orderId의 상품 목록을 가져오기

    getOrderItems(`api4/order/${orderID}`,
      ({ data }) => {
        console.log('상품 목록: ', data)
        Setcount(data.length - 1)
        SetOrderData(data[0].name)
        setProducts(data)
        // data.map((item, i) => {
        //   console.log('이 주문건의 상품 고유번호 : ', item.product)
        //   getItemDetail(`api4/pdt_list/search/${item.product}`,
        //     (res) => {
        //       if (i === 0) {
        //         SetOrderData(res.data.item) // 해당 주문의 대표 상품명
        //       }
        //       // console.log(i, res.data) // 상품명 출력
        //       setProducts(prevProducts => [...prevProducts,  // 상태 업데이트
        //       {
        //         'name': res.data.item,
        //         'pdt_idx': res.data.id,
        //         'count': item.quantity,
        //         'sctg_seq': item.small_cate,
        //       }
        //       ]); // 해당 주문건 상품의 이름, 고유번호, 수량, 소분류를 저장
        //       if (i === data.length - 1) {
        //         func();
        //       }
        //     },
        //     handleError
        //   );
        // }) // 주문번호로 가져온 데이터를 처리
      },
      handleError
    )
  } // 해당 주문 건의 상품 데이터 가져오기
  
  useEffect(() => {
    handleOrderData(orderId);
  }, [])

  useEffect(() => {
    handleOrderData(orderId);
  }, [func])

  return (
    <div>
      <Collapse
        items={[
          {
            key: '1',
            label: `${orderDate}에 주문하신 상품이 도착하였습니다.`, // 알림 제목 - 3월 1일에 주문하신 상품이 배송 완료되었습니다.
            children: (
              <MessageBox>
                {/* 알림 내용 */}
                <StyledP>{orderData}{count > 0 ? ` 외 ${count}개의 품목` : ''}</StyledP>
                {
                  products?.map((item, i) => {
                    if (products.length > 1) {
                      return (
                        <div key={i}>
                          <p>{item.name}</p>
                        </div>
                      )
                    }
                  })
                }
                <Button onClick={() => handleConfirm(alarmId)}>
                  확인
                </Button>
              </MessageBox>
            )
          },
        ]}
      />
    </div>
  )
}



