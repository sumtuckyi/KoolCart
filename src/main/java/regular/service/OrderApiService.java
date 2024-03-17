package regular.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Data
@Service
public class OrderApiService {
    private final String ORDER_API_URL = "http://i10a101.p.ssafy.io:8000/api4/order/";

    public void placeOrder(Integer userId, List<Map<String, Object>> products) {
        // JSON 데이터 생성
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString = "";

        // List<Integer>을 JSON 문자열로 변환
        try {
            // 정기배송이면 standard : 0
            jsonString = objectMapper.writeValueAsString(new OrderRequest(userId, products, 0));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // HttpEntity 생성 (헤더와 JSON 문자열을 함께 설정)
        HttpEntity<String> requestEntity = new HttpEntity<>(jsonString, headers);

        // REST 템플릿 생성
        RestTemplate restTemplate = new RestTemplate();

        // 주문 API 호출
        restTemplate.postForObject(ORDER_API_URL, requestEntity, String.class);

        System.out.println(requestEntity);
    }

    @Data
    private static class OrderRequest {
        private final Integer user;
        private final String pdts;  // 상품 ID와 수량을 포함하는 정보
        private final Integer standard; // 정기배송, 일반 배송 식별 인자

        public OrderRequest(Integer user, List<Map<String, Object>> products, Integer standard) {
            this.user = user;
            this.standard = standard;
            // List<Integer>을 JSON 문자열로 변경
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                this.pdts = objectMapper.writeValueAsString(products);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error converting productIds to JSON string", e);
            }
        }
    }
}
