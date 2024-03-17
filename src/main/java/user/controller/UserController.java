package user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import user.bean.UserDTO;
import user.dao.UserDAO;
import user.service.UserService;

//@CrossOrigin(origins = "http://172.20.10.10:5173")
@RequestMapping("/user")
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserDAO userDAO;

    @PostMapping("/signup")
    public int signupSave(@RequestBody UserDTO user) {
        //System.out.println(user);
        userService.signupSave(user);
        System.out.println(user.getUserSeq());
        return user.getUserSeq();
    }

    @PostMapping("/login")
    public int login(@RequestBody UserDTO userDTO){
        int loginResult = userService.login(userDTO);
        System.out.println("userDTO = " + userDTO);
        if(loginResult >= 0){
            System.out.println("test");
            //로그인 성공
            //session.setAttribute("loginID", userDTO.getId());
            //로그인 성공시 userSeq 반환
            return loginResult;
        }else{
            //로그인 실패
            return -1;
        }
    }

    //마이페이지 유저 정보 불러오기
    @GetMapping("/mypage/{userSeq}")
    public UserDTO getUserData(@PathVariable("userSeq") Integer userSeq){
        System.out.println(userSeq);
        return userDAO.findByUserSeq(userSeq);
    }

   // qr코드 생성해서 user정보 받기
   @GetMapping("/signupqrcode")
   public int loginQrCode() {
       int createUser = userService.findLastUserSeq() + 1;
       System.out.println(createUser);
       return createUser;
   }

    @PostMapping("/signupmobile")
    public ResponseEntity<String> scanQrCode(@RequestBody UserDTO user){
        System.out.println(1);
        userService.signupSave(user);
        System.out.println(user.getUserSeq());
        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping("/qrsignupcheck/{userSeq}")
    public int qrsignupcheck(@PathVariable("userSeq") Integer userSeq){
        System.out.println("userSeq = " + userSeq);
        UserDTO userDTO = userDAO.findByUserSeq(userSeq);
        if(userDTO != null){
            if(userDTO.getId() != null)
                return 1;

      }
        else
            return 0;

        return 0;
    }

    @PutMapping("/update/{userSeq}")
    public ResponseEntity<String> updateUserInfo(@PathVariable("userSeq") Integer userSeq, @RequestBody UserDTO updatedUserInfo) {
        userService.userInfoUpdate(userSeq, updatedUserInfo);
        System.out.println(updatedUserInfo);
        return ResponseEntity.ok("유저 정보가 변경되었습니다.");
    }

    /*
     * @GetMapping("/checkId")
     * public ResponseEntity<?> checkIdDuplicate(@RequestParam String id) {
     * userService.checkIdDuplicate(id);
     * return ResponseEntity.status(HttpStatus.OK).build();
     * }
     *
     * @PostMapping("/checkPw")
     * public ResponseEntity<UserResponseDto> check(
     *
     * @AuthenticationPrincipal User user,
     *
     * @RequestBody Map<String, String> request) {
     * String pw = request.get("pw");
     * UserResponseDto userInfo = userService.check(user, pw);
     * return ResponseEntity.status(HttpStatus.OK).body(userInfo);
     * }
     *
     *
     *
     */

}