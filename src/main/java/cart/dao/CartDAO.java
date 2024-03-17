package cart.dao;

import cart.bean.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import user.bean.UserDTO;

import java.util.List;

@Repository
public interface CartDAO extends JpaRepository<Cart, Integer> {

    // 해당 유저의 장바구니 품목 모두 가져오기
    List<Cart> findByUserSeq(UserDTO userSeq);

    // 유저가 선택한 품목 삭제하기
    void deleteByCartSeq(int cartSeq);

    // 특정 품목의 수량 변경하기
    @Modifying
    @Query("UPDATE Cart c SET c.count = :count WHERE c.cartSeq = :cartId AND c.userSeq = :userSeq")
    void updateCount(
            @Param("cartId") int cartId,
            @Param("count") int count,
            @Param("userSeq") UserDTO userSeq);

    // 장바구니에 새로운 품목 추가하기
    Cart save(Cart newPdt);

    // 해당 유저의 장바구니 품목 중 상품 고유번호로 항목 찾아오기
    Cart findByUserSeqAndPdtSeq(UserDTO user, int pdtSeq);
}
