import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Register.css'; 
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Grid, IconButton } from '@mui/material';
import rgerror from './rgerror.png'
import modaljpg from './rgmodal.png'
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal'; 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';



const REGISTER_API_BASE_URL = "/api/register";

function Register() {
  const categoryData = useSelector((state) => state.data.category);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [smallCategory, setSmallCategory] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Redux 사용해서 사용자 정보 가져오기
  const userSeq = useSelector((state) => state.user.userSeq);


  //모달
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [modalText, setModalText] = useState('');

 // 모달 열기 함수
 const openModal = (text) => {
  setModalText(text);
  setIsModalOpen(true);
};

// 모달 닫기 함수
const closeModal = () => {
  setIsModalOpen(false);
  setModalText('');
};



// 필수 값 입력 모달 

 const [isRequiredModalOpen, setIsRequiredModalOpen] = useState(false);

  // 모달 열기 함수
  const openRequiredModal = () => {
    setIsRequiredModalOpen(true);
  };

  // 모달 닫기 함수
  const closeRequiredModal = () => {
    setIsRequiredModalOpen(false);
  };

 

  const DemoPaper = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(1.5),
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }));


  // 수량 증가 및 감소 함수
const handleIncrementCount = () => {
  setNewStock((prev) => ({
    ...prev,
    count: prev.count + 1
  }));
};

const handleDecrementCount = () => {
  setNewStock((prev) => ({
    ...prev,
    count: Math.max(0, prev.count - 1) // 0보다 작아지지 않도록 
  }));
};


  useEffect(() => {
    // categoryData가 변경될 때마다 대분류 초기화
    setSelectedCategory('');
  }, [categoryData]);

  useEffect(() => {
    // 대분류가 선택될 때마다 소분류 초기화
    setSmallCategory('');
  }, [selectedCategory]);

  function showDetails(idx) {
    setSelectedCategory(categoryData[idx-1].id-1);    // 0~7 
    console.log(categoryData[idx-1]);         // 1~8
    console.log(idx-1);
    console.log(selectedCategory);
    // setSmallCategories(categoryData[idx-1].small_categories);
    // console.log(categoryData[idx-1].small_categories);
  }

  function showSmall(idx, s_idx) {
    setSmallCategory(categoryData[idx-1]?.small_categories[s_idx-1]?.id);
    setNewStock((prev) => ({ ...prev, sctg_seq: categoryData[idx]?.small_categories[s_idx-1]?.id}))
    console.log(categoryData[idx]?.small_categories[s_idx-1]?.id )
  }

  const [temporaryStockList, setTemporaryStockList] = useState([]);
  const [newStock, setNewStock] = useState({
    user_seq: userSeq,
    sctg_seq: '',
    pdt_seq: 0,
    name: '',
    count: 0,
    exp: null,
  });

  const handleAddToTemporaryList = () => {
  

    if ( !newStock.name || newStock.count == 0) {
      openRequiredModal();
      return;
    }


    setTemporaryStockList((prevList) => [...prevList, newStock]);
    setNewStock({
      user_seq: userSeq,
      sctg_seq: '',
      pdt_seq: 0,
      name: '',
      count: 0,
      exp: null,
    });
    setSmallCategory(''); // 소분류 초기화
    setSelectedCategory(''); // 대분류 초기화

  };

  const handleRemoveFromTemporaryList = (index) => {
    setTemporaryStockList((prevList) => {
      const updatedList = [...prevList];
      console.log(updatedList);
      updatedList.splice(index, 1);
      return updatedList;
    });
  };

  const handleSaveAll = async () => {
    if (temporaryStockList.length === 0) {
      // temporaryStockList가 비어 있으면 필수 값 입력 모달을 열고 함수를 종료
      openRequiredModal();
      return;
    }
    
    try {
      await axios.post(`${REGISTER_API_BASE_URL}/save-all`, temporaryStockList);
      // console.log('All stocks saved successfully.');
      setTemporaryStockList([]);
      openModal('저장 완료!');
      
    } catch (error) {
      console.error('Error saving stocks:', error);
    }
  };


  const handleDateTimeChange = (newValue) => {
    setNewStock((prev) => ({ ...prev, exp: newValue }));
  };


  return (
    <div className='wholecontainer'>
    <div className="rgcontainer"> 
      <div className="rgcard">
        <div className='rgcardheader'>
        <h2>제품 수기 입고</h2>
        </div>
          <div>
            <div className="rginputContainer">
              <div className="rglabelContainer">
              <label style={{fontSize: 'larger'}}>대분류 </label>
              </div>
              <div className="rginputWrapper">
                <select className="rginput" value={categoryData[selectedCategory]?.name} onChange={(e) => showDetails(e.target.selectedIndex)}>
                  <option value="">-- 선택하세요 --</option>
                  {categoryData.map((category, idx) => (
                    <option key={idx} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 수정 시작: 소분류 */}
            <div className="rginputContainer">
              <div className="rglabelContainer">
              <label style={{fontSize: 'larger'}}>소분류</label>
              </div>
              <div className="rginputWrapper">
                <select className="rginput" value={smallCategory?.name} onChange={(e) => showSmall(selectedCategory, e.target.selectedIndex)}>
                  <option value="">-- 선택하세요 --</option>
                  {categoryData[selectedCategory]?.small_categories?.map((smallCategory, idx) => (
                    <option key={idx} value={smallCategory.id}>
                      {smallCategory?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* 수정 끝: 소분류 */}

            {/* 추가 시작: 제품명 */}
            <div className="rginputContainer">
              <div className="rglabelContainer">
              <label style={{fontSize: 'larger'}}>제품명</label>
              </div>
              <div className="rginputWrapper">
                <input
                  className='rginput'
                  type="text"
                  inputMode="text"
                  value={newStock.name}
                  onChange={(e) => setNewStock((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
            {/* 추가 끝: 제품명 */}

            {/* 추가 시작: 수량 */}
            <div className="rginputContainer">
              <div className="rglabelContainer">
              <label style={{fontSize: 'larger'}}>수량</label>
              </div>
              <div className="rginputWrapper">
              <Grid container spacing={1} alignItems="center" className="rginputWrapper">
                  <Grid item>
                    <Button
                    sx={{ fontWeight: 'bold', fontSize: '20px', backgroundColor: 'lightgray',
                      color: 'black', '&:hover': { backgroundColor: 'gray' } }}
                      variant="contained" onClick={handleDecrementCount}>-</Button>
                  </Grid>
                  <Grid item>
                    <input
                      className='rginput'
                      type="number"
                      inputMode="numeric"
                      value={newStock.count}
                      onChange={(e) => setNewStock((prev) => ({ ...prev, count: parseInt(e.target.value, 10) }))}
                      InputProps={{ inputProps: { min: 0 } }} 
                      
                    />
                  </Grid>
                  <Grid item>
                    <Button 
                    sx={{ fontWeight: 'bold', fontSize: '20px', backgroundColor: 'lightgray',
                    color: 'black', '&:hover': { backgroundColor: 'gray' } }}
                    variant="contained" onClick={handleIncrementCount}>+</Button>
                  </Grid>
                </Grid>
              </div>
            </div>
            {/* 추가 끝: 수량 */}

            {/* 추가 시작: 유통기한 */}
            <div className="rginputContainer">
              <div className="rglabelContainer">
              <label style={{fontSize: 'larger'}}>유통기한</label>
              </div>
              <div className="rginputWrapper">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="exp"
                  value={newStock.exp}
                  onChange={handleDateTimeChange}
                  Input={(params) => <TextField {...params} />}
                  sx={{ width: '258px' }}
                />
              </LocalizationProvider>
              </div>
            </div>
            {/* 추가 끝: 유통기한 */}

        <button className="rgbutton" onClick={handleAddToTemporaryList}>목록에 추가하기</button>
      </div>
    </div>                        
        <div className="rgcard">
        <div className='rgcardheader'>
        <h2>추가 목록</h2>
        </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>제품명</TableCell>
                  <TableCell>유통기한</TableCell>
                  <TableCell>수량</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {temporaryStockList.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={`/images/${stock.sctg_seq}.png`}
                        alt="banner"
                        loading="lazy"
                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell>
                      <label style={{fontSize: 'larger'}}>{stock.name}</label>
                    </TableCell>
                    <TableCell>
                      <label style={{fontSize: '15px'}}>
                        {stock.exp ? stock.exp.format('YYYY-MM-DD') : ''}
                        
                        </label>
                    </TableCell>
                    <TableCell>
                      <label style={{fontSize: 'larger'}}>{stock.count}</label>
                    </TableCell>
                    <TableCell>
                      <IconButton color="lightgray" onClick={() => handleRemoveFromTemporaryList(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <button className="rgbutton" onClick={handleSaveAll}>입력 완료</button>
        </div>
      </div>
      <Modal open={isModalOpen} onClose={closeModal} className="rg-modal">
      <div className="rg-modal-content">
        <div className="rgsmallcon">
        <img src={modaljpg} alt="Modal Image" className="rg-modal-image" />
        <Typography variant="h6" className="rg-modal-text">
          {modalText}
        </Typography>
        </div>
        <div>
        <button className='rgokbutton' onClick={closeModal}>확인</button>
        </div>
      </div>
      
    </Modal>



    <Modal open={isRequiredModalOpen} onClose={closeRequiredModal} className="rg-modal">
        <div className="rg-modal-content">
          <div className="rgsmallcon">
            <img src={rgerror} alt="Modal Image" className="rg-modal-image" />
            <Typography variant="h6" className="rg-modal-text">
              필수 값을 입력하세요.
            </Typography>
          </div>
          <div>
            <button className='rgokbutton' onClick={closeRequiredModal}>확인</button>
          </div>
        </div>
      </Modal>

    </div>
    
  );

                

}

export default Register;
