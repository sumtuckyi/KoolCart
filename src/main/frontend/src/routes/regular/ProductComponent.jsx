import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function ProductComponent({ regular }) {

  // 개수 반영된 총 가격 계산, 포맷 적용
  // 처음 나오는 '원'까지만 가격으로 사용
  const extractedNumberWithWon = regular.price.match(/(\d+,?\d*)원/);
  const extractedNumber = extractedNumberWithWon ? parseInt(extractedNumberWithWon[1].replace(',', ''), 10) : 0;
  const totalPrice = extractedNumber * regular.count;
  const formattedPrice = totalPrice.toLocaleString('ko-KR');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Grid item xs={4} sx={{ mt: 2, textAlign: 'center' }}>
        <Box>
          <img
            src={regular.img_url}
            alt="img"
            style={{ width: '50%', height: '50%', objectFit: 'cover' }}
          />
        </Box>
      </Grid>
      <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <Box sx={{ mt: 2 }}>
              <Typography variant='h6' sx={{ fontWeight: '600'}} gutterBottom>{regular.name}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', my:1 }}>{formattedPrice}원</Typography>
              <Typography variant='body2' sx={{ fontWeight: '600'}} gutterBottom>{regular.count}개</Typography>
              <Typography variant='body2' sx={{ fontWeight: '600'}} color="#32A4FF" gutterBottom>{regular.cycle}일에 한 번</Typography>
        </Box>
      </Grid>
    </Box>
  );
}

export default ProductComponent;