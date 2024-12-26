package conect.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import conect.data.entity.ShareEntity;

public interface ShareRepository extends JpaRepository<ShareEntity, String> {
	@Modifying
	@Query("UPDATE ShareEntity s SET s.shareUser = :shareUser WHERE s.todo.id = :todoId")
	void saveByTodo(@Param("shareUser") String shareUser, @Param("todoId") int todoId);

}
