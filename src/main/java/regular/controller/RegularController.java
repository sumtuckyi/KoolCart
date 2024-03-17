package regular.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import regular.bean.RegularClient;
import regular.bean.RegularDTO;
import regular.service.RegularService;
import user.bean.UserDTO;
import user.dao.UserDAO;

import java.util.List;

@RequestMapping("/regular")
@RestController
public class RegularController {

    @Autowired
    private RegularService regularService;

    @Autowired
    private UserDAO userDAO;

    // 회원 정기배송 리스트 가져오기
    @GetMapping("/list/{userSeq}")
    public List<RegularDTO> getRegularList(@PathVariable("userSeq") Integer userSeq) {
        UserDTO user = userDAO.findByUserSeq(userSeq);

        return regularService.findAllByUserSeq(user);
    }

    // 정기배송 정보 수정
    @PutMapping("/update/{rdSeq}")
    public ResponseEntity<String> updateRegular(@PathVariable("rdSeq") Integer rdSeq, @RequestBody RegularDTO updatedRegular) {
        regularService.regularUpdate(rdSeq, updatedRegular);
        System.out.println(updatedRegular);
        return ResponseEntity.ok("정기배송이 수정되었습니다.");
    }
    
    // 정기배송 해지
    @GetMapping("/delete/{rdSeq}")
    public void regularDelete(@PathVariable("rdSeq") Integer rdSeq) {
        regularService.regularDelete(rdSeq);
    }
    
    // 정기배송 상품 추가
    @PostMapping("/write")
    public ResponseEntity<String> regularWrite(@RequestBody RegularClient regularClient) {
        System.out.println(regularClient);
        // userDTO 가져오기
        UserDTO userDTO = userDAO.findByUserSeq(regularClient.getUserSeq());

        // regularDTO 만들기
        RegularDTO regularDTO = new RegularDTO();

        // regularClient에서 받은 정보로 regularDTO 채우기
        regularDTO.setRdSeq(regularClient.getRdSeq());
        regularDTO.setUserSeq(userDTO);
        regularDTO.setPdtSeq(regularClient.getPdtSeq());
        regularDTO.setName(regularClient.getName());
        regularDTO.setImg_url(regularClient.getImg_url());
        regularDTO.setPrice(regularClient.getPrice());
        regularDTO.setCount(regularClient.getCount());
        regularDTO.setCycle(regularClient.getCycle());
        regularDTO.setNextOrder(regularClient.getNextOrder());
        regularDTO.setLastOrder(regularClient.getLastOrder());
        
        regularService.regularWrite(regularDTO);
        return ResponseEntity.ok("정기배송이 추가되었습니다.");
    }
}
