package cart.bean;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import user.bean.UserDTO;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "cart")
public class Cart {

    // 필드 정의
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_seq", nullable = false)
    private int cartSeq;
    @Column(name = "pdt_seq", nullable = false)
    private int pdtSeq;
    @Column(name = "count", nullable = false)
    private int count;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "img_url", nullable = false)
    private String imgUrl;
    @Column(name = "price", nullable = false)
    private String price;

    // 외래키 필드
    @ManyToOne
    @JoinColumn(name = "user_seq", nullable = false)
    private UserDTO userSeq;

}
