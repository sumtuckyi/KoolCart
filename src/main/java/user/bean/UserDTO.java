package user.bean;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user")
@Data
public class UserDTO {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_seq", nullable = false)
    private int userSeq;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "id", nullable = false, unique = true)
    private String id;
    @Column(name = "pw", nullable = false)
    private String pw;
    @Column(name = "email1")
    private String email1;
    @Column(name = "email2")
    private String email2;
    @Column(name = "ph_num")
    private String phNum;
    @Column(name = "zipcode")
    private String zipcode;
    @Column(name = "addr1")
    private String addr1;
    @Column(name = "addr2")
    private String addr2;
}
