package cart.rest;

import cart.CartRequest;
import cart.bean.Cart;
import cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import user.bean.UserDTO;
import user.dao.UserDAO;

import java.util.List;
import java.util.Map;

@RequestMapping("/carts")
@RestController
public class CartRestController {

    @Autowired
    private final CartService cartService;
    @Autowired
    private final UserDAO userRepository;

    public CartRestController(CartService cartService, UserDAO userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    // 유저 고유번호로 해당 유저 장바구니 품목 전부 가져오기
    @GetMapping("/products/{userSeq}")
    public List<Cart> getListByUserSeq(@PathVariable("userSeq") int userSeq) {
        System.out.println(userSeq);
        UserDTO user = userRepository.findByUserSeq(userSeq);
        // 해당 유저가 없는 경우
        if (user == null) {
            throw new RuntimeException("user is not found.");
        }
        // 해당 유저는 존재하나 해당 유저의 장바구니 품목이 없는 경우
        // 빈배열이 반환되므로 추후 처리
        return cartService.findByUserSeq(user);
    }

    // 장바구니 품목 고유번호를 받아서 해당 항목을 삭제
    @DeleteMapping("/{cartSeq}")
    public ResponseEntity<String> deleteItem(@PathVariable("cartSeq") int cartSeq) {

        cartService.deleteByCartSeq(cartSeq);
        return ResponseEntity.ok("deleted");
    }

    // 장바구니에서 해당 품목의 수량을 변경
    @PutMapping("/")
    public ResponseEntity<String> updateCount(@RequestBody CartRequest cartRequest) {

        int userSeq = cartRequest.getUserSeq();
        int cartSeq = cartRequest.getCartSeq();
        int count = cartRequest.getCount();

        System.out.println("count: " + count + " cartSeq: " + cartSeq + " userSeq: " + userSeq);
        UserDTO user = userRepository.findByUserSeq(userSeq);
        cartService.updateCount(cartSeq, count, user);

        return ResponseEntity.ok("count is updated");
    }

    // @PutMapping("/test")
    // public Cart updateCnt(@RequestBody Cart theCart) {
    //
    // Cart dbCart = cartService.save(theCart);
    // return dbCart;
    // }

    @PostMapping("/")
    public ResponseEntity<String> addProduct(@RequestBody CartRequest cartRequest) {

        int userSeq = cartRequest.getUserSeq();
        int pdtId = cartRequest.getPdtSeq();
        int count = cartRequest.getCount();
        String name = cartRequest.getName();
        String imgUrl = cartRequest.getImgUrl();
        String price = cartRequest.getPrice();

        UserDTO user = userRepository.findByUserSeq(userSeq);
        // Check if the product with pdtId exists in the user's cart
        Cart existingCart = cartService.findByUserSeqAndPdtSeq(user, pdtId);

        if (existingCart != null) {
            // If the product exists, update the count
            existingCart.setCount(existingCart.getCount() + 1);
            cartService.save(existingCart);
        } else {
            // If the product doesn't exist, add it to the cart
            Cart newCart = new Cart();
            newCart.setCount(count);
            newCart.setPdtSeq(pdtId);
            newCart.setUserSeq(user);
            newCart.setName(name);
            newCart.setImgUrl(imgUrl);
            newCart.setPrice(price);
            cartService.save(newCart);
        }

        return ResponseEntity.ok("Product added successfully");
    }

    // // 유저 고유번호, 상품 번호로 장바구니에서 품목 가져오기
    // @PostMapping("/products")
    // @ResponseBody
    // public void getPdtByUserSeq(@RequestBody Map map) {
    //
    // int userSeq = Integer.parseInt(map.get("user_seq").toString());
    // int pdtSeq = Integer.parseInt(map.get("pdt_seq").toString());
    // String name = map.get("pdt_seq").toString();
    // String price = map.get("price").toString();
    // String imgUrl = map.get("img_url").toString();
    // int category = Integer.parseInt(map.get("category").toString());
    //
    // UserDTO user = userRepository.findByUserSeq(userSeq);
    // // 해당 유저가 없는 경우
    // if (user == null) {
    // throw new RuntimeException("user is not found.");
    // }
    // // 해당 유저는 존재하나 해당 유저의 장바구니 품목이 없는 경우
    // // 빈배열이 반환되므로 추후 처리
    //
    // Cart cartData = cartService.findByUserSeqAndPdtSeq(user, pdtSeq);
    // if (cartData == null) {
    // System.out.println("insert");
    // Cart newCart = new Cart();
    // newCart.setCount(count);
    // newCart.setPdtSeq(pdtId);
    // newCart.setUserSeq(user);
    // newCart.setName(name);
    // newCart.setImgUrl(imgUrl);
    // newCart.setPrice(price);
    // cartService.save(newCart);
    // }
    // else {
    // System.out.println("update");
    //
    // }
    // }
}
