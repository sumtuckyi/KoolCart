package user.service;

import java.util.List;
//import user.bean.response.UserResponseDto;
//import user.common.exception.ResourceNotFoundException;
//import user.repo.UserRepository;

import user.bean.UserDTO;

//@Service
//@RequiredArgsConstructor
//@Transactional
//@Slf4j
public interface UserService {

    // 사용자 정보 최초 입력 받기
    public void signupSave(UserDTO userDTO);

    //로그인
    public int login(UserDTO userDTO);

    //마이페이지 조회
    public List<UserDTO>findAll();

    //마이페이지 유저 정보 수정
    public void userInfoUpdate(Integer user_seq, UserDTO updatedUserInfo);

    //user_seq 가장 큰것 찾기
    public int findLastUserSeq();



    /*
     * private final UserRepository userRepository;
     * private final PasswordEncoder encoder;
     *
     *
     * public HttpStatus checkIdDuplicate(String id) {
     * isExistUserId(id);
     * return HttpStatus.OK;
     * }
     *
     * public UserResponseDto register(UserSignupDto signupDto) {
     * isExistUserId(signupDto.getId());
     * checkPassword(signupDto.getPw(), signupDto.getPwCheck());
     *
     * // 패스워드 암호화
     * String encodePw = encoder.encode(signupDto.getPw());
     * signupDto.setPw(encodePw);
     *
     * User saveUser = userRepository.save(
     * UserSignupDto.toEntity(signupDto));
     *
     * return UserResponseDto.fromEntity(saveUser);
     * }
     *
     *
     * public UserTokenDto login(UserLoginDto loginDto) {
     * authenticate(loginDto.getId(), loginDto.getPw());
     * UserDetails userDetails =
     * userDetailsService.loadUserByName(loginDto.getId());
     * checkEncodePassword(loginDto.getPw(), userDetails.getPw());
     * String token = jwtTokenUtil.generateToken(userDetails);
     * return UserTokenDto.fromEntity(userDetails, token);
     * }
     *
     * public UserResponseDto check(User user, String pw) {
     * User checkUser = (User) userDetailsService.loadUserByName(User.getUserSeq());
     * checkEncodePassword(pw, checkUser.getPw());
     * return UserResponseDto.fromEntity(checkUser);
     * }
     *
     *
     * 업데이트
     * 비밀번호 체크
     *
     *
     * public UserResponseDto update(User user, UserUpdateDto updateDto) {
     * checkPassword(updateDto.getPw(), updateDto.getPwCheck());
     * String encodePw = encoder.encode(updateDto.getPw());
     * User updateUser = userRepository.findByUserSeq(user.getName()).orElseThrow(
     * () -> new ResourceNotFoundException("User", "User Id", user.getId())
     * );
     * updateUser.update(encodePw, updateDto.getName());
     * return UserResponseDto.fromEntity(updateUser);
     * }
     *
     *
     * 사용자 인증
     *
     * @param id
     *
     * @param pw
     *
     * private void authenticate(String id, String pw){
     * try {
     * authenticationManager.authenticate(new
     * UsernamePasswordAuthenticationToken(id, pw));
     * // } catch (DisabledException e) {
     * // throw new UserException("인증되지 않은 아이디입니다.", HttpStatus.BAD_REQUEST);
     * } catch (BadCredentialsException e) {
     * throw new UserException("비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
     * }
     * }
     *
     *
     * 아이디(이메일) 중복 체크
     *
     * @param id
     *
     * private void isExistId(String id) {
     * if (userRepository.findById(id).isPresent()) {
     * throw new UserException("이미 사용 중인 아이디입니다.", HttpStatus.BAD_REQUEST);
     * }
     * }
     *
     *
     * 비밀번호와 비밀번호 확인이 같은지 체크
     *
     * @param pw
     *
     * @param pwCheck
     *
     * private void checkPassword(String pw, String pwCheck) {
     * if (!pw.equals(pwCheck)) {
     * throw new UserException("패스워드 불일치", HttpStatus.BAD_REQUEST);
     * }
     * }
     *
     *
     * 사용자가 입력한 비번과 DB에 저장된 비번이 같은지 체크 : 인코딩 확인
     *
     * @param rawPw
     *
     * @param encodedPw
     *
     * private void checkEncodePassword(String rawPw, String encodedPw) {
     * if (!encoder.matches(rawPw, encodedPw)) {
     * throw new UserException("패스워드 불일치", HttpStatus.BAD_REQUEST);
     * }
     * }
     *
     */
}