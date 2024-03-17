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
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo1 from '../../assets/logo1.png';
import LoginService from './LoginService';

function loadDaumPostcodeScript() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

const defaultTheme = createTheme();

export default function SignUpMobile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState("");
  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  const [zipcode, setZipcode] = React.useState("");
  const handleZipcode = (e) => {
    setZipcode(e.target.value);
  };

  const [addr1, setAddr1] = React.useState("");
  const handleAddr1 = (e) => {
    setAddr1(e.target.value);
  };

  const [addr2, setAddr2] = React.useState("");
  const handleAddr2 = (e) => {
    setAddr2(e.target.value);
  };

  useEffect(() => {
    loadDaumPostcodeScript().then(() => {
      const element_wrap = document.getElementById('wrap');

      window.sample3_execDaumPostcode = function () {
        var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        new window.daum.Postcode({
          oncomplete: function (data) {
            var addr = '';
            var extraAddr = '';

            if (data.userSelectedType === 'R') {
              addr = data.roadAddress;
            } else {
              addr = data.jibunAddress;
            }

            if (data.userSelectedType === 'R') {
              if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraAddr += data.bname;
              }
              if (data.buildingName !== '' && data.apartment === 'Y') {
                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
              }
              if (extraAddr !== '') {
                extraAddr = ' (' + extraAddr + ')';
              }
              document.getElementById("sample3_extraAddress").value = extraAddr;
            } else {
              document.getElementById("sample3_extraAddress").value = '';
            }

            document.getElementById('sample3_postcode').value = data.zonecode;
            document.getElementById("sample3_address").value = addr;
            document.getElementById("sample3_detailAddress").focus();

            element_wrap.style.display = 'none';
            document.body.scrollTop = currentScroll;
          },
          onresize: function (size) {
            element_wrap.style.height = size.height + 'px';
          },
          width: '100%',
          height: '100%'
        }).embed(element_wrap);

        element_wrap.style.display = 'block';
        element_wrap.parentElement.style.height = 'auto';
      };
    });
  }, []);

  const foldDaumPostcode = () => {
    const element_wrap = document.getElementById('wrap');
    element_wrap.style.display = 'none';
  };

  function Logo({width}){
    return(
      <div class="koolcartlogo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo1} alt="logo" style={{width:width}}/>
      </div>
    );
  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData(event.currentTarget);

      const userData = {
        name: data.get('name'),
        id: data.get('id'),
        pw: data.get('pw'),
        email1: data.get('email1'),
        email2: selected,
        phNum: data.get('phNum'),
        zipcode: data.get('zipcode'),
        addr1: data.get('addr1'),
        addr2: data.get('addr2'),
      };

        await LoginService.qrlogincheck(userData);
        alert("기기의 로그인하기 버튼을 눌러주세요")
        navigate("/")

    } catch (error) {
      console.error('양식 처리 중 오류 발생:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ marginLeft: '5%', marginTop: '2%' }}>
        
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
            {/* <LockOutlinedIcon /> */}
            <Logo width="80%" />
          <Typography component="h1" variant="h5">
            회원가입
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="이름"
                  name="name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="id"
                  label="아이디"
                  name="id"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="pw"
                  label="비밀번호"
                  type="password"
                  id="pw"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      name="email1"
                      fullWidth
                      id="email1"
                      label="이메일 아이디"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" style={{ marginRight: '5px' }}>@</Typography>
                    <select className="email2" onChange={handleSelect} value={selected} id="email2" style={{ width: '100%', height: '100%' }}>
                      <option value="null">선택</option>
                      <option value="naver.com">naver.com</option>
                      <option value="google.com">google.com</option>
                      <option value="daum.net">daum.net</option>
                      <option value="nate.com">nate.com</option>
                      <option value="kakao.com">kakao.com</option>
                    </select>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phNum"
                  label="핸드폰번호"
                  name="phNum"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <input type="text" onChange={handleZipcode} value={zipcode} id="zipcode" placeholder="우편번호" readOnly />
                <input type="button" onClick={window.sample3_execDaumPostcode} value="우편번호 찾기" readOnly /><br />
                <input type="text" onChange={handleAddr1} value={addr1} id="addr1" placeholder="주소" /><br />
                <input type="text" onChange={handleAddr2} value={addr2} id="addr2" placeholder="상세주소" />
                <input type="text" id="addr3" placeholder="참고항목" />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="alwayslogin" color="primary" defaultChecked />}
                  label="이 기기에서는 항상 자동으로 로그인합니다."
                />
              </Grid>
            </Grid>
            <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          회원가입 및 로그인
        </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  이미 계정이 있다면 로그인
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
