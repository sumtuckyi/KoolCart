package cart.service;

import cart.bean.Cart;
import user.bean.UserDTO;

import java.util.List;

public interface CartService {

    List<Cart> findByUserSeq(UserDTO userSeq);

    void deleteByCartSeq(int cartSeq);

    void updateCount(int cartId, int count, UserDTO userSeq);

    Cart save(Cart theCart);

    Cart findByUserSeqAndPdtSeq(UserDTO user, int pdtId);
}
