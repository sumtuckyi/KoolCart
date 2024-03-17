package message.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import message.bean.MessageDTO;
import user.bean.UserDTO;

import java.util.List;

@Repository
public interface MessageDAO extends JpaRepository<MessageDTO, Integer> {

    MessageDTO findByAlarmIdAndUserId(Integer alarmId, UserDTO user);

    List<MessageDTO> findByUserIdAndChecked(UserDTO user, boolean b);



    List<MessageDTO> findByUserIdAndAlarmCategoryAndChecked(UserDTO user, Integer alarmId, boolean b);

    MessageDTO findByAlarmId(Integer alarmId);


    List<MessageDTO> findByUserIdAndDelivered(UserDTO user, boolean b);

    List<MessageDTO> findByUserIdAndDeliveredAndChecked(UserDTO user, boolean b, boolean b1);
}
