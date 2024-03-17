package category.bean;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name="sub_category")
@ToString
@Data
public class SctgDTO {
	
	@Id
	@Column(name="sctg_seq")
	private int sctg_seq;
	
	@Column(name="mctg_seq")
	private int mctg_seq;
	
	@Column(name="name")
	private String name;
}