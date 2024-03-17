package stock.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import category.bean.CategoryInterface;
import stock.bean.StockDTO;
import stock.bean.StockInterface;
import stock.dao.StockDAO;

@Service
public class StockServiceImpl implements StockService {
   
	@Autowired
	private StockDAO stockDAO;
	
    @Scheduled(cron = "0 0 0 * * *")
//	@Scheduled(cron = "0 * * * * *")
    public void expMessageTask() {
		System.out.println("매일 자정에 유통기한 임박 메세지가 추가됩니다.");
		
		List<StockDTO> list = stockDAO.stock_check_exp();
		for(StockDTO data : list) {
			int userSeq = data.getUser_seq();
			int ivtSeq = data.getIvt_seq();
			stockDAO.stock_message_exp(userSeq, ivtSeq);
		}
    }
	
	@Override
	public List<StockInterface> stock_total(Map map) {
        int userSeq = Integer.parseInt(map.get("user_seq").toString());
        int ctgType = Integer.parseInt(map.get("ctg_type").toString());
		return stockDAO.stock_total(userSeq, ctgType);
	}
	
	@Override
	public List<StockInterface> stock_total_exp(int user_seq) {
		
		return stockDAO.stock_total_exp(user_seq);
	}
	
	@Override
	public List<StockDTO> stock_total_favorite(Map map) {
		
        int userSeq = Integer.parseInt(map.get("user_seq").toString());
		return stockDAO.stock_total_favorite(userSeq);
	}
	
	@Override
	public List<StockDTO> stock_detail(Map map) {
		
        int userSeq = Integer.parseInt(map.get("user_seq").toString());
        int sctgSeq = Integer.parseInt(map.get("sctg_seq").toString());

        return stockDAO.stock_detail(userSeq, sctgSeq);
	}
	
	@Override
	public List<StockDTO> stock_detail_sctg_exp(Map map) {
		
        int userSeq = Integer.parseInt(map.get("user_seq").toString());
        int sctgSeq = Integer.parseInt(map.get("sctg_seq").toString());
        		
        return stockDAO.stock_detail_sctg_exp(userSeq, sctgSeq);
	}
	@Override
	public List<StockDTO> stock_detail_mctg_exp(Map map) {
		
        int userSeq = Integer.parseInt(map.get("user_seq").toString());
        int mctgSeq = Integer.parseInt(map.get("mctg_seq").toString());
        		
        return stockDAO.stock_detail_mctg_exp(userSeq, mctgSeq);
	}
	
	@Override
	public List<CategoryInterface> stock_mctg(Map map) {
		
        int userSeq = Integer.parseInt(map.get("user_seq").toString());
        int mctgSeq = Integer.parseInt(map.get("mctg_seq").toString());

        return stockDAO.stock_mctg(userSeq, mctgSeq);
	}
	
	@Override
	public void stock_favorite_toggle(Map map) {
		
		int ivtSeq = Integer.parseInt(map.get("ivt_seq").toString());
        int userSeq = Integer.parseInt(map.get("user_seq").toString());

        stockDAO.stock_favorite_toggle(ivtSeq, userSeq);
	}
	
	@Override
	public void stock_add(Map map) {
		
        int ivt_seq = Integer.parseInt(map.get("ivt_seq").toString());
        
		stockDAO.stock_add(ivt_seq);
	}
	
	@Override
	public void stock_remove(Map map) {
		
		int ivt_seq = Integer.parseInt(map.get("ivt_seq").toString());
		
		stockDAO.stock_remove(ivt_seq);
	}
	
	@Override
	public void stock_count_delete(int user_seq) {
		
		stockDAO.stock_count_delete(user_seq);
	}
	
	@Override
	public void stock_message_add(StockDTO pdt) {
		
		stockDAO.stock_message_add(pdt);
	}
}