package main.dao;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import main.bean.MainDTO;

@Repository
public interface MainDAO extends JpaRepository<MainDTO, Integer> {
	
//    @Query("SELECT m FROM MainDTO m")
//    List<MainDTO> findAllPersons();
}