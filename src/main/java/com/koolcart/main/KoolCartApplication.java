package com.koolcart.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = { "main.*", "regular.*", "user.*", "message.*", "stock.*", "register.*", "cart.*" })
@EntityScan({ "main.bean", "regular.bean", "user.bean", "message.bean", "stock.bean", "register.bean", "cart.bean", "category.bean" })
@EnableJpaRepositories({ "main.dao", "regular.dao", "user.dao", "message.dao", "stock.dao", "register.dao", "cart.dao" })
@EnableScheduling // 정기 주문
public class KoolCartApplication {

	public static void main(String[] args) {
		SpringApplication.run(KoolCartApplication.class, args);
	}
}