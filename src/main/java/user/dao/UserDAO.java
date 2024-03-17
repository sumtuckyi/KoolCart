package user.dao;

import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import user.bean.UserDTO;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDAO extends JpaRepository<UserDTO, Integer> {

    //     아이디 중복확인
    // boolean existById(String id);

    UserDTO findByUserSeq(int userSeq);

    //로그인 기능 - 아이디 있는지 찾기
    UserDTO findById(String id);

    //마이페이지 조회

//     비밀번호 일치여부
    //마지막 user_seq찾기
    UserDTO findFirstByOrderByUserSeqDesc();
}
