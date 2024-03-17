package regular.bean;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class RegularClient {
    private Integer rdSeq;
    private Integer userSeq;
    private Integer pdtSeq;
    private String name;
    private String img_url;
    private String price;
    private Integer count = 1;
    private Integer cycle = 7;
    private LocalDate nextOrder;
    private LocalDate lastOrder;
}
