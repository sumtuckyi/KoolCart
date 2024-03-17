package main.bean;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="test")
@Data
public class MainDTO {
	
	@Id
	@Column(name="seq")
	private int seq;
	
	@Column(name="name")
	private String name;
}