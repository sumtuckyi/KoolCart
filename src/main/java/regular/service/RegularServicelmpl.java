package regular.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import regular.bean.RegularDTO;
import regular.bean.RegularRequest;
import regular.dao.RegularDAO;
import user.bean.UserDTO;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RegularServicelmpl implements RegularService {

    @Autowired
    private RegularDAO regularRepository;

    @Autowired
    private OrderApiService orderApiService;

    @Autowired
    private RegularNotificationService regularNotificationService;

    // 정기배송 상품 추가
    @Override
    public void regularWrite(RegularDTO regularDTO) {
        System.out.println(regularDTO);
        regularRepository.save(regularDTO);
    }

    @Override
    public List<RegularDTO> findAll() {
        return regularRepository.findAll();
    }

    @Override
    public RegularDTO findByKeys(Integer rd_seq, Integer product_seq, Integer user_seq) {
        Optional<RegularDTO> optionalRegularDTO = regularRepository.findByRdSeq(rd_seq);

        // 만약 값이 존재한다면 가져오고, 없으면 null을 반환
        return optionalRegularDTO.orElse(null);
    }

    @Override
    public List<RegularDTO> findAllByUserSeq(UserDTO id) {
        return regularRepository.findAllByUserSeq(id);
    }

    @Transactional
    public void regularDelete(Integer rd_seq) {
        regularRepository.deleteByRdSeq(rd_seq);
    }

    // 정기배송 상품 페이지 처리
    @Override
    public Page<RegularDTO> boardList(Pageable pageable) {
        return regularRepository.findAll(pageable);
    }

    @Override
    public void regularUpdate(Integer rd_seq, RegularDTO updatedRegular) {
        // rdSeq 해당하는 RegularDTO
        Optional<RegularDTO> existingRegularOptional = regularRepository.findById(rd_seq);

        System.out.println(updatedRegular);
        // RegularDTO가 존재하면 새로운 정보로 업데이트
        existingRegularOptional.ifPresent(existingRegular -> {
            existingRegular.setCount(updatedRegular.getCount());
            existingRegular.setCycle(updatedRegular.getCycle());
            existingRegular.setNextOrder(updatedRegular.getNextOrder());
            existingRegular.setLastOrder(updatedRegular.getLastOrder());

            // 변경된 정보를 업데이트
            regularRepository.save(existingRegular);
        });
    }

    // 정기 배송 주문
    @Override
//     @Scheduled(cron = "0 * * * * ?") // 테스트용 매 분마다 주문
    @Scheduled(cron = "0 0 13 * * ?") // 매일 13시에 실행해서 정기 주문
    public void performRegularOrder() {

        LocalDate currentDate = LocalDate.now();

        // 해당 일자의 주문만 가져오기
        List<RegularDTO> ordersToProcess = regularRepository.findByNextOrder(currentDate);

        for (RegularDTO regular : ordersToProcess) {
            System.out.println(regular);

            // 상품 주문하기 위한 정보
            List<Map<String, Object>> products = Collections.singletonList(
                    Map.of("pdt_id", regular.getPdtSeq(), "count", regular.getCount())
            );

            // 상품 주문
            orderApiService.placeOrder(regular.getUserSeq().getUserSeq(), products);

            // order 다음 주기로 변경
            regular.setNextOrder(regular.getNextOrder().plusDays(regular.getCycle()));

            // lastOrder 해당 일자로 변경
            regular.setLastOrder(currentDate);

            // DB에 수정
            regularRepository.save(regular);
            System.out.println("Order updated " + regular);
        }
    }

    @Override
//     @Scheduled(cron = "0 * * * * ?") // 테스트용 매 분마다 알림 생성
    @Scheduled(cron = "0 0 13 * * ?") // 매일 13시에 실행해서 1일후 정기배송알림
    public void makeAlarmRegularOrder() {
        LocalDate nextDay = LocalDate.now().plusDays(1);

        // 해당 일자의 주문만 가져오기
        List<RegularDTO> ordersToAlart = regularRepository.findByNextOrder(nextDay);
        System.out.println(ordersToAlart);

        for (RegularDTO regular : ordersToAlart) {
            // 알림 보내기
            RegularRequest messageRequest = new RegularRequest();
            messageRequest.setUser_seq(regular.getUserSeq().getUserSeq());
            messageRequest.setMc_seq(2); // 정기배송 알림 카테고리 : 2
            messageRequest.setRd_seq(regular.getRdSeq());
            regularNotificationService.sendNotification(messageRequest);
        }
    }
}
