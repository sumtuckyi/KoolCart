package message.bean;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class MessageRequest {
    private Integer user_seq;
    private Integer mc_seq;
    private Integer ms_seq;
    private Integer order_seq;
    private Integer ivt_seq;
    private Integer rd_seq;
}
