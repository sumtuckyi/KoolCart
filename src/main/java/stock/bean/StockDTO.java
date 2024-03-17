package stock.bean;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name="inventory")
@ToString
@Data
public class StockDTO {
	
	@Id
	@Column(name="ivt_seq")
	private int ivt_seq;
	
	@Column(name="user_seq")
	private int user_seq;
	
	@Column(name="sctg_seq")
	private int sctg_seq;
	
	@Column(name="pdt_seq")
	private int pdt_seq;
	
	@Column(name="name")
	private String name;
	
	@Column(name="count")
	private int count;
	
	@Column(name="favorite")
	private boolean favorite;
	
	@Column(name="exp")
	private LocalDateTime exp;
}