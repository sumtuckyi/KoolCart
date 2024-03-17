package stock.service;

import java.util.List;
import java.util.Map;

import category.bean.CategoryInterface;
import stock.bean.StockDTO;
import stock.bean.StockInterface;

public interface StockService {
	
	public List<StockInterface> stock_total(Map map);
	
	public List<StockInterface> stock_total_exp(int user_seq);	

	public List<StockDTO> stock_total_favorite(Map map);
	
	public List<StockDTO> stock_detail(Map map);

	public List<StockDTO> stock_detail_sctg_exp(Map map);
	
	public List<StockDTO> stock_detail_mctg_exp(Map map);

	public List<CategoryInterface> stock_mctg(Map map);
	
	public void stock_favorite_toggle(Map map);
	
	public void stock_add(Map map);

	public void stock_remove(Map map);

	public void stock_count_delete(int user_seq);

	public void stock_message_add(StockDTO pdt);
}