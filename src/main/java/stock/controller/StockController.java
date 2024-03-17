package stock.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import category.bean.CategoryInterface;
import jakarta.servlet.http.HttpSession;
import stock.bean.StockDTO;
import stock.bean.StockInterface;
import stock.service.StockService;

@RequestMapping("/stock")
@RestController
public class StockController {
	@Autowired
	private StockService stockService;
	
	//해당 유저의 모든 재고 정보 가져오기
	@PostMapping("/total")
	@ResponseBody
	public List<StockInterface> stock_total(@RequestBody Map map){
		List<StockInterface> list = stockService.stock_total(map);
		System.out.println("stock_total = " + list);
		return list;
	}
	
	//해당 유저의 재고중 유통기한이 3일 이내인 상품만 가져오기
	@PostMapping("/total/exp")
	@ResponseBody
	public List<StockInterface> stock_total_exp(@RequestBody Map map){
		int user_seq = Integer.parseInt(map.get("user_seq").toString());
		List<StockInterface> list = stockService.stock_total_exp(user_seq);
//		System.out.println("stock_total_exp = " + list);
		for (StockInterface item : list) {
			System.out.println("ivt_seq = " + item.getIvt_seq());
			System.out.println("user_seq = " + item.getUser_seq());
			System.out.println("sctg_seq = " + item.getSctg_seq());
			System.out.println("name = " + item.getName());
			System.out.println("count = " + item.getCount());
			System.out.println("exp = " + item.getExp());
		}

		return list;
	}
	
	//해당 유저의 즐겨찾기된 상품만 가져오기
	@PostMapping("/total/favorite")
	@ResponseBody
	public List<StockDTO> stock_total_favorite(@RequestBody Map map){
		List<StockDTO> list = stockService.stock_total_favorite(map);
		System.out.println("stock_total_favorite = " + list);
		return list;
	}
	
	//재고중 수량이 0개가 된 품목을 삭제한다
	@PostMapping("/total/count/delete")
	@ResponseBody
	public void stock_count_delete(@RequestBody Map map){
		int user_seq = Integer.parseInt(map.get("user_seq").toString());
		stockService.stock_count_delete(user_seq);
		System.out.println("stock count 0 delete!");
	}
	
	//해당 유저의 sub_category에 맞는 재고를 가져오기
	@PostMapping("/detail")
	@ResponseBody
	public List<StockDTO> stock_detail(@RequestBody Map map){
		List<StockDTO> list = stockService.stock_detail(map);
		System.out.println("stock_detail = " + list);
		return list;
	}
	
	//해당 유저의 sub_category에 맞는 재고를 유통기한 순으로 정렬해서 가져오기
	@PostMapping("/detail/sctg/exp")
	@ResponseBody
	public List<StockDTO> stock_detail_sctg_exp(@RequestBody Map map){
		List<StockDTO> list = stockService.stock_detail_sctg_exp(map);
		System.out.println("stock_detail_sctg_exp = " + list);
		return list;
	}
	
	//해당 유저의 main_category에 맞는 재고를 유통기한 순으로 정렬해서 가져오기
	@PostMapping("/detail/mctg/exp")
	@ResponseBody
	public List<StockDTO> stock_detail_mctg_exp(@RequestBody Map map){
		List<StockDTO> list = stockService.stock_detail_mctg_exp(map);
		System.out.println("stock_detail_mctg_exp = " + list);
		return list;
	}
	
	@PostMapping("/mctg")
	@ResponseBody
	public List<CategoryInterface> stock_mctg(@RequestBody Map map){
		List<CategoryInterface> list = stockService.stock_mctg(map);
		System.out.println("stock_mctg = " + list);
		return list;
	}
	
	@PostMapping("/toggle/favorite")
	@ResponseBody
	public void stock_favorite_toggle(@RequestBody Map map){
		
		stockService.stock_favorite_toggle(map);
		System.out.println("stock_favorite_toggle!");
	}
	
	@PostMapping("/add")
	@ResponseBody
	public void stock_add(@RequestBody Map map){
		
		stockService.stock_add(map);
	}
	
	@PostMapping("/remove")
	@ResponseBody
	public void stock_remove(@RequestBody Map map){
		
		stockService.stock_remove(map);
	}
	
	@PostMapping("/message/add")
	@ResponseBody
	public void stock_message_add(@RequestBody List<StockDTO> pdtList){
		
		for(StockDTO pdt : pdtList) {
			stockService.stock_message_add(pdt);
		}
		System.out.println("배송확정 상품 추가 완료!");
	}
}