package register.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import register.bean.RegisterDTO;
import register.dao.RegisterDAO;
import regular.bean.RegularDTO;
import regular.dao.RegularDAO;
import regular.service.RegularService;

@Service
public class RegisterServicelmpl implements RegisterService {


    @Autowired
    private RegisterDAO registerRepository;
    @Override
    public void registerWrite(RegisterDTO registerDTO) {
        System.out.println("sad: " + registerDTO);
        registerRepository.save(registerDTO);
    }
}

