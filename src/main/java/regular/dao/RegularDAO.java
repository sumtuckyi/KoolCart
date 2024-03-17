package regular.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import regular.bean.RegularDTO;
import user.bean.UserDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegularDAO extends JpaRepository<RegularDTO, Integer> {
    Optional<RegularDTO> findByRdSeq(Integer rdSeq);

    List<RegularDTO> findAllByUserSeq(UserDTO userSeq);

    void deleteByRdSeq(Integer rdSeq);

    List<RegularDTO> findByNextOrder(LocalDate order);
}
