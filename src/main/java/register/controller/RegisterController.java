package register.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import register.bean.RegisterDTO;
import register.service.RegisterService;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/register")
@RestController
public class RegisterController {


    private List<RegisterDTO> temporaryRegisterList = new ArrayList<>();

    @Autowired
    private RegisterService registerService;
    @PostMapping("/save-all")
    public ResponseEntity<String> saveAll(@RequestBody List<RegisterDTO> registerDTOList) {
//        System.out.println(registerDTOList);
        try {
            // 순회하여 각 StockDTO를 DB에 저장
            for (RegisterDTO registerDTO : registerDTOList) {
                System.out.println("registerDTOList = " + registerDTOList);
                registerService.registerWrite(registerDTO);
            }
//            System.out.println("stockDTOList = " + registerDTOList);
            return ResponseEntity.ok("All stocks saved successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving stocks.");
        } finally {
            temporaryRegisterList.clear();  // 임시 목록 비우기
        }
    }

}
