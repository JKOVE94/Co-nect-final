package conect.data.repository;

import conect.data.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity,Integer> {
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//회사 코드 확인
	@Query("SELECT u FROM user u WHERE user_fk_comp_num = ?1")
	UserEntity findUserCompNum(@Param("user_fk_comp_num")int compPkNum);
	
	
	//사번 확인
	@Query("SELECT u FROM user u WHERE user_pk_num = ?1")
	UserEntity findUserNum(@Param("user_pk_num")int userPkNum);
	
	//비밀번호 확인
	@Query("SELECT u FROM user u WHERE user_pw =?1")
	UserEntity findUserPw(@Param("user_pw")String userPw);
	
	//계정 잠금 확인_ 1이면 잠금계정
	@Query("SELECT locked FROM user u WHERE fk_comp_num = ?1 AND pk_num = ?2")
	UserEntity lockNumChecked(@Param("user_fk_comp_num")int compPkNum, @Param("user_pk_num")int userPkNum);
	//if(lockNumChecked(compnum, usernum) == 1){return "잠금계정.."} 이렇게 할까..?
	
	
	//로그인 실패시 시도 횟수 증가_UPDATE
	@Query("UPDATE user SET user_trynum = user_trynum + 1 WHERE user_fk_comp_num = ?1 AND user_pk_num = ?2")
	UserEntity IncrementTryNum(@Param("user_fk_comp_num")int compPkNum, @Param("user_pk_num")int userPkNum);
	
	
	//로그인 성공시 횟수 초기화_UPDATE
	@Query("UPDATE user SET user_trynum = 0 WHERE user_fk_comp_num = ?1 AND user_pk_num = ?2")
	UserEntity resetTryNum(@Param("user_fk_comp_num")int compPkNum, @Param("user_pk_num")int userPkNum);
	
	
	//UserTryNum 확인-> 5회 이상 잠금처리...
	@Query("SELECT user_trynum FROM user WHERE user_fk_comp_num = ?1 AND user_pk_num = ?2")
	UserEntity checkTryNum(@Param("user_fk_comp_num")int compPkNum, @Param("user_pk_num")int userPkNum);
	
	
	//로그인 시도 횟수 5회 초과시 계정 잠금 처리(locked -> 1)_UPDATE
	@Query("UPDATE user SET user_locked = 1 WHERE user_fk_comp_num = ?1 AND user_pk_num = ?2")
	UserEntity lockUserAccount(@Param("user_fk_comp_num")int compPkNum, @Param("user_pk_num")int userPkNum);
	
	
	
	
}
