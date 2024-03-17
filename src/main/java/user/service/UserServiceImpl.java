package user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import user.bean.UserDTO;
import user.dao.UserDAO;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userRepository;

    //회원가입
    @Override
    public void signupSave(UserDTO userDTO) {
        userRepository.save(userDTO);
        //System.out.println("userDTO = " + userDTO);
    }

    //로그인
    @Override
    public int login(UserDTO userDTO) {
        // 회원이 입력한 아이디로 DB에서 조회
        UserDTO dbUser = userRepository.findById(userDTO.getId());

        if (dbUser != null) {
            // DB에서 조회한 비밀번호와 사용자가 입력한 비밀번호가 일치하는지 확인
            String dbPassword = dbUser.getPw();
            String inputPassword = userDTO.getPw();
            System.out.println("db:" + dbPassword + " input:" + inputPassword);

            if (dbPassword.equals(inputPassword)) {
                // 비밀번호가 일치하는 경우
                // user sequence 반환
                System.out.println("user_seq = " + dbUser.getUserSeq());
                return dbUser.getUserSeq();
            } else {
                // 비밀번호 일치하지 않는 경우 (로그인 실패)
                return -1;
            }
        } else {
            // 조회 결과가 없다 (해당 아이디를 가진 회원 정보가 없을 경우)
            return -1;
        }
    }

    //마이페이지 띄우기
    @Override
    public List<UserDTO> findAll(){
        return userRepository.findAll();
    }


    //마이페이지 유저 정보 수정
    @Override
    public void userInfoUpdate(Integer user_seq, UserDTO updatedUserInfo){
        UserDTO updateUser = userRepository.findByUserSeq(user_seq);

        updateUser.setPw(updatedUserInfo.getPw());
        updateUser.setEmail1(updatedUserInfo.getEmail1());
        updateUser.setEmail2(updatedUserInfo.getEmail2());
        updateUser.setZipcode(updatedUserInfo.getZipcode());
        updateUser.setAddr1(updatedUserInfo.getAddr1());
        updateUser.setAddr2(updatedUserInfo.getAddr2());

        userRepository.save(updateUser);
    }

    //user table에서 가장 마지막에 있는 id값 가져오기
    @Override
    public int findLastUserSeq() {
        UserDTO userDTO = userRepository.findFirstByOrderByUserSeqDesc();
        return userDTO.getUserSeq();
    }

}
