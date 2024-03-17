package main.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import main.bean.MainDTO;
import main.dao.MainDAO;

@Service
public class MainServiceImpl implements MainService {
   
	@Autowired
	private MainDAO mainDAO;
	
	@Override
	public List<MainDTO> test_mysql() {
		
		return mainDAO.findAll();
	}
}
