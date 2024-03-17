import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { Typography, Paper, Grid, Button, Modal, Tooltip, IconButton} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Box, ThemeProvider, createTheme, spacing } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import { red, blue, green, purple } from '@mui/material/colors';

import DetailModal from './DetailModal';
import CartModal from './CartModal';

const DemoPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(1.5),
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

const Content = () => {
  const [stockData, setStockData] = useState([]);
  const [modal1States, setModal1States] = useState({});
  const [modal2States, setModal2States] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  const theme = useTheme();
  const [ctgType, setCtgType] = useState(0);

  const userSeq = useSelector((state) => state.user.userSeq);

  useEffect(() => {
    axios.post('/api/stock/total', {
      user_seq: userSeq,
      ctg_type: ctgType
    })
    .then(response => { setStockData(response.data) });
  }, []);

  useEffect(() => {
    axios.post('/api/stock/total', {
      user_seq: userSeq,
      ctg_type: ctgType
    })
    .then(response => { setStockData(response.data) });
  }, [ctgType])

  useEffect(() => {
    const initialState1 = {};
    stockData.forEach((_, index) => {
      initialState1[`modal${index + 1}`] = false;
    });
    setModal1States(initialState1);

    const initialState2 = {};
    stockData.forEach((_, index) => {
      initialState2[`modal${index + 1}`] = false;
    });
    setModal1States(initialState2);
  }, [stockData]);

  const handleOpen1 = (modalId) => {
    setModal1States((prevStates) => ({
      ...prevStates,
      [modalId]: true,
    }));
  };

  const handleClose1 = (modalId) => {
    
    setModal1States((prevStates) => ({
      ...prevStates,
      [modalId]: false,
    }));

    axios.post('/api/stock/total/count/delete', {
      user_seq: userSeq,
    }).then(response => {
      axios.post('/api/stock/total', {
        user_seq: userSeq,
        ctg_type: ctgType
      })
      .then(response => { setStockData(response.data) });
    });
  };

  const handleOpen2 = (modalId) => {
    setModal2States((prevStates) => ({
      ...prevStates,
      [modalId]: true,
    }));
  };

  const handleClose2 = (modalId) => {
    setModal2States((prevStates) => ({
      ...prevStates,
      [modalId]: false,
    }));

    axios.post('/api/stock/total', {
      user_seq: userSeq,
      ctg_type: ctgType
    })
    .then(response => { setStockData(response.data) });
  };

  const getRemainingTime = (expirationTime) => {

    const expTime = new Date(expirationTime).getTime();
    const remainingTime = expTime - currentTime.getTime();

    // 분으로 변환
    const minutes = Math.floor(remainingTime / (1000 * 60));

    return minutes;
  };

  const handleChange = (event, newValue) => {
    setCtgType(newValue);
  };

  const handleChangeIndex = (index) => {
    setCtgType(index);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          // width: 500,
          position: 'relative',
          // minHeight: 200,
          borderRadius: '50%',
          mb: '15px'
        }}
      >
        <AppBar position="static" color="default">
          <Tabs
            value={ctgType}
            onChange={handleChange}
            TabIndicatorProps={{style: { backgroundColor: "#567cf9" }}}
            textColor="primary"
            variant="fullWidth"
            aria-label="action tabs example"
          >
            <Tab label="유통 기한" {...a11yProps(0)} />
            <Tab label="최신순" {...a11yProps(1)} />
            <Tab label="ㄱ - ㄴ" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
      </Box>

      {stockData.map((item, index) => (
      <Paper key={item.ivt_seq} sx={{ minWidth: 600, margin: 'auto', overflow: 'hidden', mb: 1 }}>
        {/* 첫 번째 행 */}
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
          <Grid item xs={9}>
            <Button onClick={() => handleOpen1(`modal${index+1}`)} sx={{ width: '100%', height: '100%', textAlign: 'left'}}>
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
                                    : getRemainingTime(item.exp) <= 60 * 24 * 1 // 1일 이하
                                    ? 'red'
                                    : getRemainingTime(item.exp) <= 60 * 24 * 3 // 3일 이하
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
            </Button>
            
            <Modal
              open={modal1States[`modal${index+1}`]} 
              onClose={() => handleClose1(`modal${index+1}`)}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <DetailModal sctgSeq={item.sctg_seq} />
                
            </Modal>
          </Grid>
          <Grid item xs={1} display="flex" justifyContent="center" alignItems="center">
            <Box sx={{ boxShadow: 1, borderRadius: 1, display: 'flex', justifyContent:'center', alignItems:'center', width: '60%', height: '60%' }}>
              {item.count}
            </Box>
          </Grid>
          <Grid item xs={1} display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Cart">
              <IconButton onClick={() => handleOpen2(`modal${index+1}`)}>
                <ShoppingCartIcon />
              </IconButton>
            </Tooltip>
            
            <Modal
              open={modal2States[`modal${index+1}`]} 
              onClose={() => handleClose2(`modal${index+1}`)}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <CartModal userSeq={item.user_seq} sctgSeq={item.sctg_seq} pdtSeq={item.pdt_seq} />
            </Modal>
          </Grid>
        </Grid>
      </Paper>
    ))}
    </>
  );
}

export default Content;