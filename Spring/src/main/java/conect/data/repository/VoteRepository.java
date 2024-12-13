package conect.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import conect.data.entity.VoteEntity;

public interface VoteRepository extends JpaRepository<VoteEntity, Integer>{

}
