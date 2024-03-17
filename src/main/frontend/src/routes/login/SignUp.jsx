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
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/userSlice';

function loadDaumPostcodeScript() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

const defaultTheme = createTheme();

export default function SignUp() {
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
    // 다음 우편번호 스크립트
    loadDaumPostcodeScript().then(() => {
      const element_wrap = document.getElementById('wrap');

      window.sample3_execDaumPostcode = function () {
        // 현재 scroll 위치를 저장해놓습니다.
        var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        new window.daum.Postcode({
          oncomplete: function (data) {
            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
              addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
              addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
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

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('sample3_postcode').value = data.zonecode;
            document.getElementById("sample3_address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("sample3_detailAddress").focus();

            // iframe을 넣은 element를 안보이게 합니다.
            element_wrap.style.display = 'none';

            // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌립니다.
            document.body.scrollTop = currentScroll;
          },
          // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정합니다.
          onresize: function (size) {
            element_wrap.style.height = size.height + 'px';
          },
          width: '100%',
          height: '100%'
        }).embed(element_wrap);

        // iframe을 넣은 element를 보이게 합니다.
        element_wrap.style.display = 'block';

        // iframe을 포함한 부모 element의 높이를 조정합니다.
        element_wrap.parentElement.style.height = 'auto';
      };
    });
  }, []);

  const foldDaumPostcode = () => {
    const element_wrap = document.getElementById('wrap');
    // iframe을 넣은 element를 안보이게 합니다.
    element_wrap.style.display = 'none';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData(event.currentTarget);

      // 사용자 입력 데이터를 포함한 객체 생성
      const userData = {
        name: data.get('name'),
        id: data.get('id'),
        pw: data.get('pw'),
        email1: data.get('email1'),
        email2: selected,
        phNum: data.get('phNum'),
        zipcode: zipcode,
        addr1: addr1,
        addr2: addr2
      };

      // 백엔드 API로 POST 요청 보내기
      const response = await fetch('api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log(response)

      if (response.ok) {
        alert('🎉어서오세요 환영합니다!')
        // 성공적인 응답 처리 (예: 성공 메시지 표시, 사용자 리디렉션 등)
        console.log('사용자가 성공적으로 등록되었습니다!');
        const result = await response.json();

        //userSeq redux-persist로 보내기
        const SignUpUserSeq = result;
        console.log(SignUpUserSeq);
        dispatch(setUser({userSeq:SignUpUserSeq}));
        console.log(SignUpUserSeq);

        //자동 로그인 후 메인페이지로 이동
        navigate("/");
        
      } else {
        // 오류 처리 (예: 사용자에게 오류 메시지 표시)
        console.error('사용자 등록 실패:', response.statusText);
      }
    } catch (error) {
      console.error('양식 처리 중 오류 발생:', error);
    }
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
            회원가입
          </Typography>
          {/* 우편번호 서비스를 위한 요소들 */}
          <div id="wrap" style={{ display: 'none', border: '1px solid', width: '500px', height: '300px', margin: '5px 0', position: 'relative' }}>
            <img src="//t1.daumcdn.net/postcode/resource/images/close.png" id="btnFoldWrap" style={{ cursor: 'pointer', position: 'absolute', right: '0px', top: '-1px', zIndex: '1' }} alt="접기 버튼" onClick={foldDaumPostcode} />
          </div>
          {/* 회원가입 폼 */}
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
                {/* 우편번호 검색을 위한 버튼 */}
                
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