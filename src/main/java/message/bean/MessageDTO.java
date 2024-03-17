package message.bean;

import jakarta.persistence.*;
import lombok.*;
import regular.bean.RegularDTO;
import stock.bean.StockDTO;
import user.bean.UserDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Table(name="message")
@Data
public class MessageDTO {

    @Id //알림 고유번호
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ms_seq", nullable = false)
    private int alarmId;

    @Column(name="mc_seq", nullable = false)
    private int alarmCategory;   //알림 카테고리

    @ManyToOne
    @JoinColumn(name = "user_seq", nullable = false)
    private UserDTO userId;

    @Column(name="ms_chk", nullable = false)
    private boolean checked;

    @Column(name="order_seq")
    private Integer orderId;

    @Column(name="dv_status")
    private Boolean delivered;

    @ManyToOne
    @JoinColumn(name="ivt_seq")
    private StockDTO itemId ;

    @ManyToOne
    @JoinColumn(name = "rd_seq")
    private RegularDTO regularId ;

    @Column(name="logtime")
    private LocalDate logTime;

}
