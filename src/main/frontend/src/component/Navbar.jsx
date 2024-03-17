import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import HomeIcon from '@mui/icons-material/Home';
import KitchenIcon from '@mui/icons-material/Kitchen';
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FaceIcon from '@mui/icons-material/Face';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StorefrontIcon from '@mui/icons-material/Storefront';
import styled from 'styled-components';
import { getCartList } from "../api/getData";
import { setItems } from "../redux/cartSlice";
import { handleError } from "../api/getData";

const StyledNav = styled.nav`
  background-color: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(15px);
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
	position: fixed;
  top : 0;
	left: 0;
	width: 200px; 
  height: 100%;
`

const StyledUl = styled.ul`
  text-align: left;
	padding: 0;
  margin-left: 10%;
  margin-top: 10%;
	height: inherit;  
`

const StyledNavLink = styled(NavLink)`
  display: inline-block;
  text-decoration: none;
  color: #07261f;
  width: 160px; 
  padding: 5px;
  margin: 0;
  &.active {
    color: #121caa;
    transform: scale(1.1);
  }
`;

const StyledLi = styled.li`
  list-style: none;
  margin-bottom: 25px;
  ${StyledNavLink}.active {
    border-radius: 5px;
    background-color: #cbcef2;
  }
`

const StyledIcon = styled.div`
  font-size: 18px; 
  display: flex;
  padding: 5px;
  & svg {
    width: 20px;
    height: 20px;
    line-height: 1.2;
  }
  & p {
    margin-left: 15px;
    line-height: 1.3;
  }
  
`;

const StyledSpan = styled.span`
  box-sizing: content-box;
  background-color: #5181F6;
  border-radius: 25%;
  width: 18px;
  height: 18px;
  text-align:center;
  padding: 2px;
  margin-left: 15px;
  line-height: 1.3;
  font-size: 15px;
`

export default function NavBar() {

  const userSeq = useSelector((state) => state.user.userSeq)
  const dispatch = useDispatch();
  const cartItemCount = useSelector((state) => state.cart.items)

  useEffect(() => {
    if (userSeq !== null) { // 로그인 된 경우에만 해당 유저 장바구니 가져오기
      getCartList(
        `/api/carts/products/${userSeq}`,
        ({ data }) => {
          console.log(data)
          dispatch(setItems.setItems(data))
        },
        handleError
      )
    }
  }, [dispatch, cartItemCount]) // 장바구니 데이터 가져오기


  return (
    <StyledNav>
      <StyledUl>
        <div id='profile'>
          {userSeq ? (
            <StyledLi>
              <StyledNavLink to="/myPage">
                <StyledIcon>
                  <FaceIcon className='icon' />
                  <p>마이페이지</p>
                </StyledIcon>
              </StyledNavLink>
              <br />
            </StyledLi>

          ) : (
            <StyledLi>
              <StyledNavLink to="/login" activeClassName="active">
                <StyledIcon>
                  <FaceIcon className='icon' />
                  <p>로그인/회원가입</p>
                </StyledIcon>
              </StyledNavLink>
            </StyledLi>
          )}
        </div>
        <StyledLi>
          <StyledNavLink to="/home" activeClassName="active"><StyledIcon><HomeIcon className='icon' /><p>Home</p></StyledIcon></StyledNavLink>
        </StyledLi>
        <StyledLi>
          <StyledNavLink to="/stock" activeClassName="active"><StyledIcon><KitchenIcon className='icon' /><p>재고관리</p></StyledIcon></StyledNavLink>
        </StyledLi>
        <StyledLi>
          <StyledNavLink to="/register" activeClassName="active"><StyledIcon><AddIcon className='icon' /><p>재고추가</p></StyledIcon></StyledNavLink>
        </StyledLi>
        <StyledLi>
          <StyledNavLink to="/regular" activeClassName="active"><StyledIcon><LocalShippingIcon className='icon' /><p>정기배송</p></StyledIcon></StyledNavLink>
        </StyledLi>
        <StyledLi>
          <StyledNavLink to="/order" activeClassName="active"><StyledIcon><StorefrontIcon className='icon' /><p>새상품 주문</p></StyledIcon></StyledNavLink>
        </StyledLi>
        <StyledLi>
          <StyledNavLink to="/cart" activeClassName="active"><StyledIcon><ShoppingBagIcon className='icon' /><p>장바구니</p><StyledSpan>{cartItemCount}</StyledSpan></StyledIcon></StyledNavLink>
        </StyledLi>
      </StyledUl>
    </StyledNav>
  )
}