package stock.dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import stock.bean.StockDTO;
import stock.bean.StockInterface;
import category.bean.CategoryInterface;

@Repository
public interface StockDAO extends JpaRepository<StockDTO, Integer> {
	
//    @Query("SELECT m FROM MainDTO m")
//    List<MainDTO> findAllPersons();

    @Query(value =
            "SELECT "+
                "MIN(ivt.ivt_seq) AS ivt_seq " +
                ", ivt.user_seq " +
                ", ivt.sctg_seq " +
                ", MIN(ivt.pdt_seq) AS pdt_seq " +
                ", sc.name" +
                ", SUM(ivt.count) AS count " +
                ", MIN(ivt.exp) AS exp " +
                "FROM inventory ivt " +
                "LEFT JOIN sub_category sc on ivt.sctg_seq = sc.sctg_seq " +
                "WHERE ivt.user_seq = :userSeq " +
                "GROUP BY ivt.user_seq, ivt.sctg_seq, sc.name " +
                "ORDER BY " +
                "CASE " +
                	"WHEN :ctgType = 0 THEN MIN(ivt.exp) " +
                	"WHEN :ctgType = 1 THEN 'MIN(ivt.ivt_seq) DESC' " +
                	"WHEN :ctgType = 2 THEN sc.name " +
                	"ELSE MIN(ivt.exp) "+
                "END"
            , nativeQuery = true)
    List<StockInterface> stock_total(@Param("userSeq") int user_seq, @Param("ctgType") int ctg_type);

    @Query(value =
            "SELECT "+
                "MIN(ivt.ivt_seq) AS ivt_seq " +
                ", ivt.user_seq " +
                ", ivt.sctg_seq " +
//                ", ivt.pdt_seq " +
                ", ivt.name " +
                ", SUM(ivt.count) AS count " +
                ", MIN(ivt.exp) AS exp " +
                "FROM inventory ivt " +
                "WHERE ivt.user_seq = :userSeq AND DATEDIFF(exp, NOW()) <= 3 " +
                "GROUP BY ivt.user_seq, ivt.sctg_seq, ivt.name " +
                "ORDER BY exp"
            , nativeQuery = true)
    List<StockInterface> stock_total_exp(@Param("userSeq") int user_seq);

    @Query("SELECT st FROM StockDTO st WHERE st.user_seq = :userSeq AND st.favorite = true")
    List<StockDTO> stock_total_favorite(@Param("userSeq") int userSeq);

    @Query("SELECT st FROM StockDTO st WHERE st.user_seq = :userSeq AND st.sctg_seq = :sctgSeq")
    List<StockDTO> stock_detail(
        @Param("userSeq") int userSeq,
        @Param("sctgSeq") int sctgSeq
    );

    @Query(value =
            "SELECT "+
                "ivt.ivt_seq, " +
                "ivt.user_seq, " +
                "mc.mctg_seq AS mctg_seq, " +
                "ivt.sctg_seq, " +
                "ivt.pdt_seq, " +
                "ivt.name, " +
                "ivt.count, " +
                "ivt.favorite, " +
                "ivt.exp " +
                "FROM inventory ivt " +
                "LEFT JOIN sub_category sc on ivt.sctg_seq = sc.sctg_seq " +
                "LEFT JOIN main_category mc on sc.mctg_seq = mc.mctg_seq " +
                "WHERE ivt.user_seq = :userSeq AND mc.mctg_seq = :mctgSeq AND ivt.favorite = true"
            , nativeQuery = true)
    List<CategoryInterface> stock_mctg(
	    @Param("userSeq") int userSeq,
	    @Param("mctgSeq") int mctgSeq
	);
    
    @Modifying
    @Transactional
    @Query("UPDATE StockDTO st SET st.favorite = NOT st.favorite WHERE st.ivt_seq = :ivtSeq AND st.user_seq = :userSeq")
    void stock_favorite_toggle(@Param("ivtSeq") int ivtSeq, @Param("userSeq") int userSeq);

    @Modifying
    @Transactional
    @Query("UPDATE StockDTO st SET st.count = st.count + 1 WHERE st.ivt_seq = :ivtSeq")
    void stock_add(@Param("ivtSeq") int ivtSeq);

    @Modifying
    @Transactional
    @Query("UPDATE StockDTO st SET st.count = st.count - 1 WHERE st.ivt_seq = :ivtSeq")
    void stock_remove(@Param("ivtSeq") int ivtSeq);

    @Query(value =
            "SELECT * FROM inventory WHERE user_seq = :userSeq AND sctg_seq = :sctgSeq ORDER BY exp"
            , nativeQuery = true)
	List<StockDTO> stock_detail_sctg_exp(@Param("userSeq") int userSeq, @Param("sctgSeq") int sctgSeq);

    @Query(value =
    "SELECT "+
        "ivt.ivt_seq, " +
        "ivt.user_seq, " +
        "mc.mctg_seq AS mctg_seq, " +
        "ivt.sctg_seq, " +
        "ivt.pdt_seq, " +
        "ivt.name, " +
        "ivt.count, " +
        "ivt.favorite, " +
        "ivt.exp " +
        "FROM inventory ivt " +
        "LEFT JOIN sub_category sc on ivt.sctg_seq = sc.sctg_seq " +
        "LEFT JOIN main_category mc on sc.mctg_seq = mc.mctg_seq " +
        "WHERE ivt.user_seq = :userSeq AND mc.mctg_seq = :mctgSeq AND DATEDIFF(ivt.exp, NOW()) <= 3"
    , nativeQuery = true)
	List<StockDTO> stock_detail_mctg_exp(@Param("userSeq") int userSeq, @Param("mctgSeq") int mctgSeq);

    @Query("SELECT s FROM StockDTO s WHERE s.ivt_seq = :ivtSeq")
    Optional<StockDTO> findByIvtSeq(Integer ivtSeq);

    @Modifying
    @Transactional
    @Query("DELETE FROM StockDTO st WHERE st.user_seq = :userSeq AND st.count = 0")
	void stock_count_delete(@Param("userSeq") int userSeq);

    @Query(value = "SELECT * FROM inventory WHERE 0 <= DATEDIFF(exp, NOW()) AND DATEDIFF(exp, NOW()) <= 3 ORDER BY exp", nativeQuery = true)
    List<StockDTO> stock_check_exp();

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO message(mc_seq, user_seq, ivt_seq, dv_status, logtime) values(3, :userSeq, :ivtSeq, false, NOW());", nativeQuery = true)
	void stock_message_exp(@Param("userSeq") int userSeq, @Param("ivtSeq") int ivtSeq);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO inventory(user_seq, sctg_seq, pdt_seq, name, count, exp) values(:#{#pdt.user_seq}, :#{#pdt.sctg_seq}, :#{#pdt.pdt_seq}, :#{#pdt.name}, :#{#pdt.count}, DATE_ADD(NOW(), INTERVAL 7 DAY))", nativeQuery = true)
	void stock_message_add(@Param("pdt") StockDTO pdt);
}