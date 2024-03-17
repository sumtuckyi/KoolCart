package cart.service;

import cart.bean.Cart;
import cart.dao.CartDAO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import user.bean.UserDTO;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartDAO cartDAO;

    @Autowired
    public CartServiceImpl(CartDAO cartDAO) {
        this.cartDAO = cartDAO;
    }

    @Override
    public List<Cart> findByUserSeq(UserDTO userSeq) {
        return cartDAO.findByUserSeq(userSeq);
    }

    @Override
    @Transactional
    public void deleteByCartSeq(int cartSeq) {
        cartDAO.deleteByCartSeq(cartSeq);
    }

    @Override
    @Transactional
    public void updateCount(int cartId, int count, UserDTO userSeq) {
        cartDAO.updateCount(cartId, count, userSeq);
    }

    @Transactional
    @Override
    public Cart save(Cart theCart) {
        return cartDAO.save(theCart);
    }

    @Override
    public Cart findByUserSeqAndPdtSeq(UserDTO user, int pdtId) {
        return cartDAO.findByUserSeqAndPdtSeq(user, pdtId);
    }
}
