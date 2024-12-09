package conect.data.repository;

import conect.data.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<UserEntity,Integer> {

    @Query("SELECT u FROM UserEntity u WHERE u.userLocked=1")
    List<UserEntity> findLockedUser();
}
