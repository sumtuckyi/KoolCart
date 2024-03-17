package message.service;

import message.bean.MessageDTO;
import user.bean.UserDTO;

import java.util.List;

public interface MessageService {
    List<MessageDTO> findAllByUserId(UserDTO user);

    List<MessageDTO> findAllByUserIdAndAlarmCategory(UserDTO user, Integer alarmCategory);

    void checkedAlarm(UserDTO user, Integer alarmId);

    void checkAllAlarms(UserDTO userId);

    void addAlarms(MessageDTO messageDTO);

    void checkedDefaultAlarm(UserDTO user, Integer msSeq);

    void checkAllDefaultAlarms(UserDTO user);

    List<MessageDTO> findAllByUserIdDefault(UserDTO user);
}
