package register.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import register.bean.RegisterDTO;
import regular.bean.RegularDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegisterDAO extends JpaRepository<RegisterDTO, Integer> {

}
