import axios from "axios";

const LOGIN_API_BASE_URL = "/api/user";

class LoginService {
    signupSave(UserDTO) {
    console.log(UserDTO);
    return axios.post(`${LOGIN_API_BASE_URL}/signup`, UserDTO);
  }

  loginPage(UserDTO) {
    return axios.post(`${LOGIN_API_BASE_URL}/login`,UserDTO);
  }

  mypageLoad(userSeq){
    return axios.get(`${LOGIN_API_BASE_URL}/mypage/${userSeq}`);
  }

  mypageUpdate(userSeq, UserDTO){
    console.log(UserDTO)
    return axios.put(`${LOGIN_API_BASE_URL}/update/${userSeq}`,UserDTO);
  }

  qrsignup(){
    return axios.get(`${LOGIN_API_BASE_URL}/signupqrcode`);
  }
  qrlogincheck(UserDTO){
    console.log(UserDTO)
    return axios.post(`${LOGIN_API_BASE_URL}/signupmobile`, UserDTO);
  }
  qrsignupcheck(userSeq){
    return axios.get(`${LOGIN_API_BASE_URL}/qrsignupcheck/${userSeq}`, userSeq);
  }
}



export default new LoginService();
