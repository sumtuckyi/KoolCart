package message.service;

import message.bean.MessageDTO;
import message.dao.MessageDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import user.bean.UserDTO;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService{

    @Autowired
    private MessageDAO messageDAO;

    @Override
    public void addAlarms(MessageDTO messageDTO) {
        System.out.println(messageDTO);
        messageDAO.save(messageDTO);
    }

    //userId에 Mapping 되어있는 알림 중 alarmCategory 에 해당하는 알림의 checked가 false인 알림 리스트 가져오기
    @Override
    public List<MessageDTO> findAllByUserId(UserDTO user) {
        return messageDAO.findByUserIdAndChecked(user, false);
    }

    @Override
    public List<MessageDTO> findAllByUserIdAndAlarmCategory(UserDTO user, Integer alarmCategory) {
        return messageDAO.findByUserIdAndAlarmCategoryAndChecked(user, alarmCategory, false);
    }


    //userId에 Mapping 되어있는 알림 중 alarmId 에 해당하는 알림 checked = true로 변경
    @Override
    public void checkedAlarm(UserDTO user, Integer alarmCategory) {
        MessageDTO message = messageDAO.findByAlarmIdAndUserId(alarmCategory, user);
        if (message != null) {
            message.setChecked(true);
            message.setDelivered(true);
            messageDAO.save(message);
        }
    }

    //userId에 Mapping 되어있는 알림 중 alarmCategory 에 해당하는 모든 알림 checked = true로 변경
    @Override
    public void checkAllAlarms(UserDTO user) {
        List<MessageDTO> messages = messageDAO.findByUserIdAndChecked(user, false);
        for (MessageDTO message : messages) {
            message.setChecked(true);
            message.setDelivered(true);
        }
        messageDAO.saveAll(messages);
    }

    @Override
    public List<MessageDTO> findAllByUserIdDefault(UserDTO user){return messageDAO.findByUserIdAndDeliveredAndChecked(user,false,false);}

    @Override
    public void checkedDefaultAlarm(UserDTO user, Integer msSeq) {
        MessageDTO message = messageDAO.findByAlarmIdAndUserId(msSeq, user);
        if (message != null) {
            message.setDelivered(true);
            messageDAO.save(message);
        }
    }

    @Override
    public void checkAllDefaultAlarms(UserDTO user) {
        List<MessageDTO> messages = messageDAO.findByUserIdAndDelivered(user, false);
        for (MessageDTO message : messages) {
            message.setDelivered(true);
        }
        messageDAO.saveAll(messages);
    }



}
