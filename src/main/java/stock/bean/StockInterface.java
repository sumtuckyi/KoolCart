package stock.bean;

import java.time.LocalDateTime;

public interface StockInterface {
	
    int getIvt_seq(); // min(ivt_seq)에 해당
    int getUser_seq();
    int getSctg_seq();
    Integer getPdt_seq(); // int -> Integer로 수정함
    String getName();
    int getCount(); // sum(count)에 해당
    LocalDateTime getExp(); // min(exp)에 해당
}