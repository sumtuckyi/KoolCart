import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container'; // Material-UI의 Container 가져오기
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import QRCode from 'qrcode.react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/userSlice';
import LoginService from './LoginService';


let QrSignupUserSeq = 0;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


function QrLogin(){
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleGenerateQrCode = async () => {
    try {
      const response = await LoginService.qrsignup();
      setQrCodeUrl(`http://i10a101.p.ssafy.io/signup/${response.data}`);
      QrSignupUserSeq = response.data;
    } catch (error) {
      console.error('Fetch 오류:', error);
    }
  };

  useEffect(() => {
    handleGenerateQrCode();
  }, []);

  return (
    <Container>
      {qrCodeUrl && <QRCode value={qrCodeUrl} size={280} />}
    </Container>
  )
}


export default function LoginModal() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const QrSignupCheck = async () => {
  
  
      try {
        console.log(QrSignupUserSeq);
        const response = await LoginService.qrsignupcheck(QrSignupUserSeq);
        console.log(response.data)
        if (response.data === 1) {
          alert('어서오세요! 환영합니다🎉');
          // 모달 닫고
          // userSeq에 유저 정보 저장
          dispatch(setUser({ userSeq: QrSignupUserSeq }));
          // 홈으로 이동
          navigate("/");
        }
        else{
          alert('회원가입이 완료되지 않았습니다. 핸드폰을 확인해주세요')
        }
      } catch (error) {
        console.error('Fetch 오류 : ',error);
        console.error('서버에러메세지: ', error.response.data);
      }
    };
  
    return (
      <div>
        <Button onClick={handleOpen}>QR코드로 로그인하기</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{textAlign:'center'}}>
              <h4>아래 QR로 접속해주세요!</h4>
              <h6>QR접속 후 회원가입이 완료되면</h6>
              <h6>아래 로그인하기 버튼을 눌러주세요</h6>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <QrLogin />
            </Typography>
            <Typography id="modal-modal-loginbutton" sx={{ display: 'flex', justifyContent: 'center', margin: '10px'}}>
            <Stack spacing={2} direction="row">
              <Button onClick={QrSignupCheck} variant="contained">로그인하기</Button>
            </Stack>
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }