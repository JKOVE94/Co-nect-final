package conect.data.repository;

import conect.data.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Integer> {


    @Query("SELECT u FROM UserEntity u WHERE u.userLocked=true")
    List<UserEntity> findLockedUser();

    @Query("SELECT u FROM UserEntity u WHERE u.companyEntity.compPkNum = ?1")
    List<UserEntity> findUserByCompany(int compno);
    
    List<UserEntity> findByCompanyEntity_compPkNum(int compno);



    Optional<UserEntity> findByUserId(String userId);

}
