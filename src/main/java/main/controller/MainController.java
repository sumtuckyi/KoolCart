package main.controller;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpSession;
import main.bean.MainDTO;
import main.service.MainService;

@RestController
public class MainController {
	@Autowired
	private MainService mainService;
	
	@GetMapping("/")
	public String index() {
		return "Hello SpringBoot";
	}
	
	@GetMapping("/hello")
	public List<String> hello() {
		return Arrays.asList("Hello", "Gradle");
	}
	
	@GetMapping("/test_spring")
	public List<Map<String, String>> home() {
		List<Map<String, String>> list = new ArrayList<>();
		Map<String, String> m1 = new HashMap<>();
		m1.put("name", "Neo");
		m1.put("addr", "Gangnam");
		m1.put("age", "13");
		list.add(m1);
		
		Map<String, String> m2 = new HashMap<>();
		m2.put("name", "Frodo");
		m2.put("addr", "Jongno");
		m2.put("age", "15");
		list.add(m2);
		
		return list;
	}
	
	@PostMapping("/test_mysql")
	@ResponseBody
	public List<MainDTO> test_mysql(){
		
		List<MainDTO> list = mainService.test_mysql();
		System.out.println("test_mysql = " + list);
		return list;
	}
}