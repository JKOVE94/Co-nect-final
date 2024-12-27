package conect.data.repository;

import conect.data.dto.UserDto;
import conect.data.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Integer> {

    @Query("SELECT u FROM UserEntity u WHERE u.userLocked=TRUE")
    List<UserEntity> findLockedUser();

    Optional<UserEntity> findByUserId(String userId);


}
