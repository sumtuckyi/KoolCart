package category.bean;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name="main_category")
@ToString
@Data
public class MctgDTO {
	
	@Id
	@Column(name="mctg_seq")
	private int mctg_seq;
	
	@Column(name="name")
	private String name;
}