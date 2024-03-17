import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/userSlice';
import LoginModal from './LoginModal';
import Modal from '@mui/material/Modal'; 
import lomodaljpg from './lomodal.png';
import { useState } from 'react';
import './Login.css'; 

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {/* 누르면 홈화면으로 가기 */}
      <Link color="inherit" href="/">
        Koolcart
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

//로그인 버튼 눌렀을 때 백엔드로 전송
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData(event.currentTarget);

      // 사용자 입력 데이터를 포함한 객체 생성
      const userData = {
        id: data.get('id'),
        pw: data.get('pw'),
      };

      // 백엔드 API로 POST 요청 보내기
      
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
  
        // 로그인 성공
        if (result >= 0) {
          openModal('성공적으로 로그인 되었습니다.');
          


          //userSeq redux-persist로 보내기
          const LoginUserSeq = result;
          console.log(LoginUserSeq);
          dispatch(setUser({userSeq:LoginUserSeq}));
        } else {
          // 로그인 실패
          console.error('로그인 실패:', result.message);
          // 아이디 또는 비밀번호 확인해달라는 alert 띄우기
          alert('아이디 또는 비밀번호를 확인해주세요!')
        }
      } else {
        // 오류 처리 
        console.error('로그인 실패:', response.statusText);
      }
    } catch (error) {
      console.error('양식 처리 중 오류 발생:', error);
    }
  };


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
  navigate("/home");
};

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ marginLeft: '39%' }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            로그인하기
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="id"
              label="아이디"
              name="id"
              autoComplete="id"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="pw"
              label="비밀번호"
              type="password"
              id="pw"
              autoComplete="current-password"
            />
            <FormControlLabel
            //구현할지 안할지 모름 체크박스가 디폴트로 해두기
              control={<Checkbox value="remember" color="primary" defaultChecked/>}
              label="이 기기에서는 자동로그인하기"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
            
              <Grid item xs>
                {/* 기능 구현할지 안할지 모름 */}
                <Link href="#" variant="body2">
                  아이디/비밀번호 찾기
                </Link>
              </Grid>

              <Grid container>
              <Grid item xs>
                <LoginModal />
              </Grid>

              <Grid item>
              <Link href="#" variant="body2" onClick={() => navigate("/signup")}>
                {"회원가입하기"}
              </Link>
              </Grid>
              
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      <Modal open={isModalOpen} onClose={closeModal} className="lo-modal">
        <div className="lo-modal-content">
          <div className="losmallcon">
          <img src={lomodaljpg} alt="Modal Image" className="lo-modal-image" />
          <Typography variant="h6" className="lo-modal-text">
            {modalText}
          </Typography>
          </div>
          <div>
          <button className='lookbutton' onClick={closeModal}>확인</button>
          </div>
        </div>
        
      </Modal>
    </ThemeProvider>
    
  );
}
