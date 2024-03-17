package cart;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
public class CartRequest {

    private int cartSeq;
    private int pdtSeq;
    private int count;
    private int userSeq;
    private String name;
    private String imgUrl;
    private String price;

}
