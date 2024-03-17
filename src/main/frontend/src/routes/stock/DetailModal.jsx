import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { Typography, Paper, Grid, Button, Modal, Tooltip, IconButton} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, ThemeProvider, createTheme, spacing } from '@mui/system';
import { Favorite as FavoriteIcon, FavoriteBorderOutlined as FavoriteBorderOutlinedIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '500px',
  width: '1000px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

const DemoPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(1.5),
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const DetailModal = ({ sctgSeq }) => {
  const [detailData, setDetailData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const userSeq = useSelector((state) => state.user.userSeq);

  useEffect(() => {
    axios.post('/api/stock/detail/sctg/exp', {
      user_seq: userSeq,
      sctg_seq: sctgSeq,
    })
    .then(response => { setDetailData(response.data) });
  }, []);

  const handleFavorite = (item) => {
    axios.post('/api/stock/toggle/favorite', {
      ivt_seq: item.ivt_seq,
      user_seq: userSeq
    })
    .then(response => {
      console.log('toggle favorite successfully!');
      axios.post('/api/stock/detail/sctg/exp', {
        user_seq: userSeq,
        sctg_seq: sctgSeq,
      })
      .then(response => { setDetailData(response.data) });
    })
    .catch(error => {console.error('Error toggle favorite:', error);});
  };

  const handleAddToCart = (item) => {
    axios.post('/api/stock/add', {
      ivt_seq: item.ivt_seq,
    })
    .then(response => {
      console.log('Item added to cart successfully!');
      axios.post('/api/stock/detail/sctg/exp', {
        user_seq: userSeq,
        sctg_seq: sctgSeq,
      })
      .then(response => { setDetailData(response.data) });
    })
    .catch(error => {console.error('Error adding item to cart:', error);});
  };

  const handleRemoveToCart = (item) => {
    axios.post('/api/stock/remove', {
      ivt_seq: item.ivt_seq,
    })
    .then(response => {
      console.log('Item Removed to cart successfully!');
      axios.post('/api/stock/detail/sctg/exp', {
        user_seq: userSeq,
        sctg_seq: sctgSeq,
      })
      .then(response => { setDetailData(response.data) });
    })
    .catch(error => {console.error('Error adding item to cart:', error);});
  };

  const getRemainingTime = (expirationTime) => {

    const expTime = new Date(expirationTime).getTime();
    const remainingTime = expTime - currentTime.getTime();

    // 분으로 변환
    const minutes = Math.floor(remainingTime / (1000 * 60));

    return minutes;
  };
    
    return (<Box sx={modalStyle}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        상세 상품정보
      </Typography>

      {detailData.map((item) => (
          <Grid key={item.ivt_seq} xs={12} sx={{ boxShadow: 1, borderRadius: 1, display: 'flex', justifyContent:'center', alignItems:'center', width: '100%', height: '100%', mb: 1 }}>
          <Grid container sx={{ml:0.5}}>
            <Grid item xs={1}>
              <DemoPaper variant="elevation">
                <img
                  src={`/images/${item.sctg_seq}.png`}
                  alt="food"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </DemoPaper>
            </Grid>

            <Grid item xs={7} sx={{display: 'flex', justifyContent:'center', alignItems:'center' }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="bold">
                      {item.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h8">
                      Expiration date :
                      <Typography
                          variant="h8"
                          sx={{ color:
                                  getRemainingTime(item.exp) <= 0
                                    ? 'gray' // 만료된 경우
                                    : getRemainingTime(item.exp) <= 1 * 24 * 60 // 1일 이하
                                    ? 'red'
                                    : getRemainingTime(item.exp) <= 3 * 24 * 60  // 3일 이하
                                    ? 'orange'
                                    : 'inherit', // 기본 색상
                              }}
                      >
                        {/* D/H/M 버전 */}
                        {/* {getRemainingTime(item.exp) <= 0
                            ? 'Expired!'
                            : getRemainingTime(item.exp) < 60 // 1시간 이하
                            ? ` ${getRemainingTime(item.exp)}M`
                            : getRemainingTime(item.exp) < 24 * 60 && getRemainingTime(item.exp) - (getRemainingTime(item.exp) / 60) * 60 === 0 // 1일 이하, 분이 0인 경우
                            ? ` ${Math.floor(getRemainingTime(item.exp) / 60)}H`
                            : getRemainingTime(item.exp) < 24 * 60
                            ? ` ${Math.floor(getRemainingTime(item.exp) / 60)}H ${getRemainingTime(item.exp) - Math.floor(getRemainingTime(item.exp) / 60) * 60}M`
                            : ` ${Math.floor(getRemainingTime(item.exp) / (60 * 24))}D ${Math.floor((getRemainingTime(item.exp) - (Math.floor(getRemainingTime(item.exp) / (60 * 24)) * (60 * 24))) / 60)}H`
                        } */}
                        {/* D버전 */}
                        {getRemainingTime(item.exp) <= 0
                            ? ' Expired!'
                            : ` ${Math.floor(getRemainingTime(item.exp) / (60 * 24))} Day`
                        }
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
            </Grid>

            <Grid item xs={1} sx={{display: 'flex', justifyContent:'flex-end', alignItems:'center' }}>
              <IconButton onClick={() => handleFavorite(item)}>
                {item.favorite ? <FavoriteIcon color="primary" /> : <FavoriteBorderOutlinedIcon />}
              </IconButton>
            </Grid>

            <Grid item xs={1} sx={{display: 'flex', justifyContent:'flex-end', alignItems:'center' }}>
              <IconButton onClick={() => handleAddToCart(item)}>
                <AddIcon />
              </IconButton>
            </Grid>

            <Grid item xs={1} display="flex" justifyContent="center" alignItems="center">
              <Box sx={{ boxShadow: 1, borderRadius: 1, display: 'flex', justifyContent:'center', alignItems:'center', width: '60%', height: '60%' }}>
                {item.count}
              </Box>
            </Grid>

            <Grid item xs={1} sx={{display: 'flex', justifyContent:'flex-start', alignItems:'center' }}>
              {item.count > 0 ? (
                <IconButton onClick={() => handleRemoveToCart(item)}>
                  <RemoveIcon />
                </IconButton>
              ) : (
                <IconButton disabled>
                  <RemoveIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Grid>
        ))}
    </Box>
    );
};

export default DetailModal;