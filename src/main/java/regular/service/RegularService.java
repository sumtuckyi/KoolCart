package regular.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import regular.bean.RegularDTO;
import user.bean.UserDTO;

import java.util.List;

public interface RegularService {
    // 정기배송 상품 추가
    public void regularWrite(RegularDTO regularDTO);

    public List<RegularDTO> findAll();

    public RegularDTO findByKeys(Integer rd_seq,
                                 Integer product_seq,
                                 Integer user_seq);

    public List<RegularDTO> findAllByUserSeq(UserDTO userDAO);

    @Transactional
    public void regularDelete(Integer rd_seq);

    // 정기배송 상품 페이지 처리
    public Page<RegularDTO> boardList(Pageable pageable);

    // 정기배송 상품 수정
    public void regularUpdate(Integer rd_seq, RegularDTO updatedRegular);

    // 정기 배송 주문
    public void performRegularOrder();

    // 정기 배송 하루 전 알림
    public void makeAlarmRegularOrder();
}
