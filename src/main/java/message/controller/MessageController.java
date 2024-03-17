package message.controller;

import message.bean.MessageDTO;
import message.bean.MessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import message.service.MessageService;
import regular.bean.RegularDTO;
import regular.dao.RegularDAO;
import stock.bean.StockDTO;
import stock.dao.StockDAO;
import user.bean.UserDTO;
import user.dao.UserDAO;

import java.sql.SQLOutput;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RequestMapping("/message")
@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private RegularDAO regularDAO;

    @Autowired
    private StockDAO stockDAO;

    @GetMapping("/test")
    public String defaultTest(){
        return "Hi PrevPage";
    }

    @PostMapping("/create")
    public ResponseEntity<String> addAlarms(@RequestBody MessageRequest messageRequest){
        UserDTO user = userDAO.findByUserSeq(messageRequest.getUser_seq());
        System.out.println(user);
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setUserId(user);
        messageDTO.setDelivered(false);
        int alarmCategory = messageRequest.getMc_seq();
        messageDTO.setAlarmCategory(alarmCategory);
        messageDTO.setChecked(false);
        // 현재 로그 시간 설정
        messageDTO.setLogTime(LocalDate.now());

        //쇼핑몰 데이터 알림에 같이 저장
        if(alarmCategory==1){
            System.out.println("Add Delivery Alarms");
            messageDTO.setOrderId(messageRequest.getOrder_seq());
        }
        //정기배송 데이터 알림에 같이 저장
        else if(alarmCategory==2){
            Integer recieved_rd_seq = messageRequest.getRd_seq();
            Integer recieved_order_seq = messageRequest.getOrder_seq();
            System.out.println("Alarm Category " + alarmCategory);
            if(recieved_rd_seq!=null){
                System.out.println("Add Regular Alarms" + messageRequest.getRd_seq());
                RegularDTO regularDTO = regularDAO.findByRdSeq(messageRequest.getRd_seq()).orElse(null);
                messageDTO.setRegularId(regularDTO);
                System.out.println(messageDTO);
            }

            if(recieved_order_seq!=null){
                messageDTO.setOrderId(messageRequest.getOrder_seq());
            }
        }
        //유통기한 데이터 알림에 같이 저장
        else if(alarmCategory==3){
            System.out.println("Add Inventory Alarms" + messageRequest.getIvt_seq());
            StockDTO stockDTO = stockDAO.findByIvtSeq(messageRequest.getIvt_seq()).orElse(null);
            messageDTO.setItemId(stockDTO);
        }
        messageService.addAlarms(messageDTO);
        System.out.println(messageDTO);
        return ResponseEntity.ok("알림이 추가되었습니다.");
    }
    //카테고리 별 List 정보 가져오기
    @PostMapping("/listAll")
    public List<MessageDTO> getAlarmList(@RequestBody MessageRequest messageRequest){
        UserDTO user = userDAO.findByUserSeq(messageRequest.getUser_seq());
        System.out.println("Find List!");
        if(user != null){
            System.out.println(messageService.findAllByUserId(user));
            return messageService.findAllByUserId(user);
        }
        return null;
    }

    @PostMapping("/listCategory")
    public List<MessageDTO> getAlarmListByAlarmCategory(@RequestBody MessageRequest messageRequest){
        UserDTO user = userDAO.findByUserSeq(messageRequest.getUser_seq());
        System.out.println("find list by alarmCategory");
        if(user!=null){
            return messageService.findAllByUserIdAndAlarmCategory(user, messageRequest.getMc_seq());
        }
        return null;
    }



    @PostMapping("/check")
    public void checkedAlarm(@RequestBody MessageRequest messageRequest){
        UserDTO user = userDAO.findByUserSeq(messageRequest.getUser_seq());
        System.out.println("Checked Alarm: "+ messageRequest.getMs_seq());
        if (user != null) {
            messageService.checkedAlarm(user, messageRequest.getMs_seq());
        }
    }

    @PostMapping("/checkAll")
    public void checkAllAlarms(@RequestBody MessageRequest messageRequest){
        UserDTO user = userDAO.findByUserSeq(messageRequest.getUser_seq());
        System.out.println("Check All Alarms");
        if(user!=null){
            messageService.checkAllAlarms(user);
        }
    }

    @PostMapping("/listAll/default")
    public List<MessageDTO> getDefaultAlarmList(@RequestBody MessageRequest messageRequest){
        UserDTO user = userDAO.findByUserSeq(messageRequest.getUser_seq());
        System.out.println("Find List for Prev Page!");
        if(user != null){
            System.out.println(messageService.findAllByUserIdDefault(user));
            return messageService.findAllByUserIdDefault(user);
        }
        return null;
    }
    @PostMapping("/check/default")
    public void checkDefaultAlarm(@RequestBody MessageRequest messageRequest){
        UserDTO user = userDAO.findByUserSeq(messageRequest.getUser_seq());
        if(user!=null){
            messageService.checkedDefaultAlarm(user,messageRequest.getMs_seq());
        }
    }

    @PostMapping("/checkAll/default")
    public void checkAllDefaultAlarm(@RequestBody MessageRequest messageRequest){
        UserDTO user = userDAO.findByUserSeq(messageRequest.getUser_seq());
        if(user!=null){
            messageService.checkAllDefaultAlarms(user);
        }
    }
}
