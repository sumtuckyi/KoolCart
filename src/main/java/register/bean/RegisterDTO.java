package register.bean;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Data
public class RegisterDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ivt_seq", nullable = false)
    private Integer ivt_seq;

    @Column
    private String name;

    @Column(nullable = false)
    private Integer count;

    @Column
    private LocalDateTime exp;

    private Integer pdt_seq;

    @Column(name = "sctg_seq", nullable = false)
    @ColumnDefault("0")
    private Integer sctg_seq;

    @Column(name = "user_seq", nullable = false)
    private Integer user_seq = 1;

    @Column(columnDefinition = "boolean default false")
    private boolean favorite;

}
