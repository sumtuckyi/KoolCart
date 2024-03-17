import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/userSlice';
import LoginService from './LoginService';
import './Login.css'; 
import Modal from '@mui/material/Modal'; 
import lomodaljpg from './lomodal.png';


function loadDaumPostcodeScript() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

export default function MyPage() {
    const dispatch = useDispatch();
    const userSeq = useSelector((state) => state.user.userSeq);
    const Navigate = useNavigate();
    const [myData, setMyData] = React.useState();
    const [selected, setSelected] = React.useState("");
    const handleSelect = (e) => {
        setSelected(e.target.value);
    };

    const logoutSubmit = () => {
        //로그아웃하면 userSeq를 0으로 함
        dispatch(setUser({userSeq: 0}));
        console.log(userSeq);
        openModal('정상적으로 로그아웃 되었습니다.');
       
    };


    useEffect(() => {
        const UserData = async () => {
            try {
                const response = await LoginService.mypageLoad(userSeq);
                console.log(response)
                setMyData(response.data);
                console.log(myData)
            } catch (error) {
                console.error('조회 도중 에러가 발생하였습니다 : ', error);
            }
        };

        UserData();
    }, [userSeq]);

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

    const userName = myData?.name || 'Default Name';
    const userId = myData?.id || 'Default ID';
    const useremail1 = myData?.email1 || 'Default Email';
    const userPhNum = myData?.ph_num || 'Default Phone Number';
    console.log(userName);

    //마이페이지 유저 정보 수정
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        
        const [password,setPassword] = useState("");
        const [checkpassword, setCheckPassword] = useState("");

        if(password !== checkpassword){
            alert('비밀번호가 일치하지 않습니다!');
            return;
        }

        const updateUserData = {
            pw: password,
            email1: data.get('email1'),
            email2: selected,
            phNum: data.get('phNum'),
            zipcode: zipcode,
            addr1: addr1,
            addr2: addr2,
        }

        try {
            const response = await LoginService.mypageUpdate(userSeq, updateUserData);

            if(response.ok){
                openModal('성공적으로 변경되었습니다.');
                
            }

        }catch(error){
            console.error('유저 정보 수정 에러:', error);
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
    Navigate("/");
    };
    

    return (
        <Container component="main" minWidth="600px" maxWidth="850px" >
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', ml: '180px', justifyContent: 'center', alignItems: 'center' }}>
            <Box
                
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    '& > div': { marginBottom: '16px' },
                    marginLeft: '0%',
                    flex: 1,
                    py: 6,
                    px: 4,
                    
                    position: 'relative',
                    overflow: 'hidden',
                }}
                noValidate
                autoComplete="off"
            >
                <div style={{
                    width: '80%',
                    margin: '10px auto',
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                이름
                <TextField
                    id="nameField"
                    value={userName}
                    InputProps={{
                        readOnly: true,
                    }}
                    variant="standard"
                    fullWidth
                /><br />
                아이디
                <TextField
                    id="idField"
                    value={userId}
                    InputProps={{
                        readOnly: true,
                    }}
                    variant="standard"
                    fullWidth
                /><br />
                비밀번호 변경
                <div className="password change" style={{ display: 'flex' }}>
                    <Grid container spacing={2} xs={12}>
                        <Grid item xs={6} style={{ flex: 1, marginRight: '5px' }}>
                            <TextField
                                id="pw"
                                name="pw"
                                label="변경할 비밀번호"
                                type="password"
                                variant="standard"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6} style={{ flex: 1 }}>
                            <TextField
                                id="pwCheck"
                                label="비밀번호 확인"
                                type="password"
                                variant="standard"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </div>
                <br />
                이메일 변경
                <div class="email change" sx ={{display:'flex'}}>
                <Grid item container spacing={2} xs={12} sm={12}>
                    <Grid item xs={6}>
                        <TextField
                            name="email1"
                            fullWidth
                            id="email1"
                            label={useremail1}
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" style={{ marginRight: '5px' }}>@</Typography>
                    </Grid>
                    <Grid item xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                        <select className="email2" onChange={handleSelect} value={selected} id="email2" style={{ width: '100%', height: '80%' }}>
                            <option value="null">선택</option>
                            <option value="naver.com">naver.com</option>
                            <option value="google.com">google.com</option>
                            <option value="daum.net">daum.net</option>
                            <option value="nate.com">nate.com</option>
                            <option value="kakao.com">kakao.com</option>
                        </select>
                    </Grid>
                </Grid>
                </div>
                <br />
                전화번호 변경
                <TextField
                    id={userPhNum}
                    variant="standard"
                    fullWidth
                /><br />
                주소 변경
                <Grid item xs={12}>
                    {/* 우편번호 검색을 위한 버튼 */}
                    <input type="text" onChange={handleZipcode} value={zipcode} id="zipcode" placeholder="우편번호" readOnly/>
                    <input type="button" onClick={window.sample3_execDaumPostcode} value="우편번호 찾기" readOnly /><br />
                    <input type="text" onChange={handleAddr1} value={addr1} id="addr1" placeholder="주소" fullWidth /><br />
                    <input type="text" onChange={handleAddr2} value={addr2} id="addr2" placeholder="상세주소" fullWidth />
                    <input type="text" id="addr3" placeholder="참고항목" fullWidth />
                </Grid>

                
                </div>
            <div class="submit button"sx ={{display:'flex'}}>
            <Button
                id="submit"
                variant="contained"
                disableElevation
                type="submit"
                sx={{
                    marginRight: '40px',
                    marginTop: '10px',
                }}
            >
                변경하기
            </Button>

            <Button
                id="logout"
                variant="contained"
                disableElevation
                onClick={logoutSubmit}
                sx={{
                    marginTop: '10px',
                }}
            >
                로그아웃
            </Button>
            </div>
        </Box>
    </Box>
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
    </Container>
);
}
