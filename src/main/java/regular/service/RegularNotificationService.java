package regular.service;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import regular.bean.RegularRequest;

@Service
public class RegularNotificationService {

    // private final String notificationEndpoint = "http://localhost:8080/message";
    private final String notificationEndpoint = "http://i10a101.p.ssafy.io:8080/message";

    public void sendNotification(RegularRequest messageRequest) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<RegularRequest> requestEntity = new HttpEntity<>(messageRequest, headers);

        restTemplate.postForEntity(notificationEndpoint + "/create", requestEntity, String.class);
    }
}
