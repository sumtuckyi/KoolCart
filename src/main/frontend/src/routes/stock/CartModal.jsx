import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Paper, Grid, Button, Modal, Tooltip, IconButton, TextField } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../api/getData";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Box, ThemeProvider, createTheme, spacing } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ItemName, ItemPrice } from '../../styles/ItemStyles';
import { message } from 'antd';
import { getCartList, handleError } from "../../api/getData";
import { setItems } from "../../redux/cartSlice";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '500px',
  width: '800px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

const CartModal = ({ userSeq, sctgSeq, pdtSeq }) => {
  const [pdtData, setPdtData] = useState([]);
  const [shopData, setShopData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if(pdtSeq != 0){
      axios.get(`http://i10a101.p.ssafy.io:8000/api4/pdt_list/search/${pdtSeq}`)
      .then(response => { 

        if (response.data.price) {
          // 처음 나오는 '원'까지만 가격으로 사용
          const extractedNumberWithWon = response.data.price.match(/(\d+,?\d*)원/);
          const extractedNumber = extractedNumberWithWon ? parseInt(extractedNumberWithWon[1].replace(',', ''), 10) : 0;
          const formattedPrice = extractedNumber.toLocaleString('ko-KR');

          response.data.price = formattedPrice + "원";
        }
        setPdtData(response.data) 
      });
    }
    axios.get(`http://i10a101.p.ssafy.io:8000/api4/pdt_list/${sctgSeq}`)
    .then(response => { 
      // 처음 나오는 '원'까지만 가격으로 사용
      const products = response.data;
      products.map((product) => {
        const extractedNumberWithWon = product.price.match(/(\d+,?\d*)원/);
        const extractedNumber = extractedNumberWithWon ? parseInt(extractedNumberWithWon[1].replace(',', ''), 10) : 0;
        const formattedPrice = extractedNumber.toLocaleString('ko-KR');

        product.price = formattedPrice + "원";
      })
      setShopData(products) 
    });
  }, []);

  const info = () => {
    message.info('장바구니에 상품이 추가되었습니다.');
  };

  const addToCart = (selectPdt) => {
    addProduct(
			'api/carts/',
			{ 
				'userSeq': userSeq,
				'pdtSeq': selectPdt.id,
				'count': 1,
				'name': selectPdt.item,
				'imgUrl': selectPdt.img_url,
				'price': selectPdt.price
			},
			(res) => {
				console.log(res)
        info()
        getCartList(
          `api/carts/products/${userSeq}`,
          ({ data }) => {
            console.log("장바구니 업데이트!")
            dispatch(setItems.setItems(data))
          },
          handleError
        )
			},
			(error) => {
				console.error(error)
			}
		)
  };

    return (
      <Box sx={modalStyle}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            간편 주문
          </Typography>
        </Grid>
        <Grid item xs={2}>
          {/* <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton> */}
        </Grid>

        {pdtSeq !== 0 ? (
          <>
          <Grid item xs={12}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              현재 내 상품
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Box>
              <img src={pdtData.img_url} alt="egg" style={{ width: '60%', height: '50%', objectFit: 'cover' }} />
              {/* 가격 : 1000원 */}
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Button
            onClick={() => addToCart(pdtData)}
            style={{ width: '100%', height: '100%' }}
            >
            <Box>
              <ItemName>{pdtData.item}</ItemName>
              <ItemPrice>{pdtData.price}</ItemPrice>
            </Box>
            </Button>
          </Grid>
          </>
        ) : null}

        <Grid item xs={12}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            추천 상품
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ overflowY: 'auto', maxHeight: '400px' }}>
        {shopData.slice(0, 5).map((item) => (
          <Grid container key={item.id} spacing={2}>

            <Grid item xs={5}>
            <Box>
              <img src={item.img_url} alt={item.productName} style={{ width: '50%', height: '50%', objectFit: 'cover' }} />
              {/* 가격 : {item.price}원 */}
            </Box>
            </Grid>
            <Grid item xs={7}>
            <Button
            onClick={() => addToCart(item)}
            style={{ width: '100%', height: '100%' }}
            >
            <Box>
              <ItemName>{item.item}</ItemName>
              <ItemPrice>{item.price}</ItemPrice>
            </Box>
            </Button>
            </Grid>

          </Grid>
        ))}
        </Grid>

      </Grid>
    </Box>
    );
};

export default CartModal;