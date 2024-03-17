package category.bean;

import java.time.LocalDateTime;

public interface CategoryInterface {
	
    int getIvt_seq(); // min(ivt_seq)에 해당
    int getUser_seq();
    int getMctg_seq();
    int getSctg_seq();
    int getPdt_seq();
    String getName();
    int getCount(); // sum(count)에 해당
    Boolean getFavorite();
    LocalDateTime getExp(); // min(exp)에 해당
}