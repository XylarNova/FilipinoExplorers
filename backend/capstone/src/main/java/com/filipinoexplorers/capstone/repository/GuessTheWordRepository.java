
package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.GuessTheWordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GuessTheWordRepository extends JpaRepository<GuessTheWordEntity, Long>{
    List<GuessTheWordEntity> findByActiveTrue();
}