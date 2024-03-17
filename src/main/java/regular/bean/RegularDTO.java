package regular.bean;

import jakarta.persistence.*;
import lombok.Data;
import user.bean.UserDTO;

import java.time.LocalDate;

@Entity
@Table(name = "regular_delivery")
@Data
public class RegularDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rd_seq", nullable = false)
    private Integer rdSeq;

    // 외래키
    @ManyToOne
    @JoinColumn(name = "user_seq", nullable = false)
    private UserDTO userSeq;

//    @Column(name = "user_seq", nullable = false)
//    private Integer userSeq;

    @Column(name = "pdt_seq", nullable = false)
    private Integer pdtSeq;

    @Column(length = 100)
    private String name;

    @Column(length = 255)
    private String img_url;

    @Column(length = 100)
    private String price;

    @Column(nullable = false)
    private Integer count = 1;

    @Column(nullable = false)
    private Integer cycle = 7;

    @Column(name = "next_order", nullable = false)
    private LocalDate nextOrder;

    @Column(name = "last_order")
    private LocalDate lastOrder;
}
