package conect.data.repository;

import conect.data.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Integer> {

    @Query("SELECT u FROM UserEntity u WHERE u.userLocked=TRUE")
    List<UserEntity> findLockedUser();

    Optional<UserEntity> findByUserId(String userId);

    @Modifying
    @Transactional
    @Query("UPDATE UserEntity u SET u.refreshToken = :refreshToken WHERE u.userId = :userId")
    void updateRefreshToken(String userId, String refreshToken);

    @Query("SELECT u.refreshToken FROM UserEntity u WHERE u.userId = :userId")
    Optional<String> findRefreshTokenByUserId(String userId);

    @Modifying
    @Transactional
    @Query("UPDATE UserEntity u SET u.refreshToken = NULL WHERE u.userId = :userId")
    void removeRefreshToken(String userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE UserEntity u SET u.refreshToken = :refreshToken, u.refreshTokenExpiry = :expiry WHERE u.userId = :userId")
    void updateRefreshTokenAndExpiry(String userId, String refreshToken, LocalDateTime expiry);
    
    Optional<UserEntity> findByRefreshToken(String refreshToken);
    
   
    

    
}
