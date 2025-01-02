package conect.service.board.recommendation;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.query.SortDirection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;

import conect.data.dto.RecommendationDto;
import conect.data.dto.ReplyDto;
import conect.data.entity.ProjectEntity;
import conect.data.entity.ReclikesEntity;
import conect.data.entity.RecommendationEntity;
import conect.data.entity.ReplyEntity;
import conect.data.entity.ReplyLikesEntity;
import conect.data.entity.UserEntity;
import conect.data.form.RecommendationForm;
import conect.data.form.ReplyForm;
import conect.data.repository.ProjectRepository;
import conect.data.repository.ReclikesRepository;
import conect.data.repository.RecommendationRepository;
import conect.data.repository.ReplyLikesRepository;
import conect.data.repository.ReplyRepository;
import conect.data.repository.UserRepository;
import conect.service.ResourceNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

@Service
public class recommendationServiceImpl implements recommendationService {

	@Autowired
	private RecommendationRepository recRepository;
	@Autowired
	private ReclikesRepository reclikesRepository;
	@Autowired
	private ProjectRepository projRepository;
	@Autowired
	private UserRepository userRepository;
	
	//모든 건의사항
	@Override
	public Page<RecommendationDto> getRecAll(int projNum, String sortField, String sortDirection, int page, int size) {
		//프로젝트 번호, 정렬 기준 컬럼, 정렬 방향(ASC/DESC), 현재 페이지, 한 페이지에 보일 글 갯수
		
		Pageable pageable;
		
		try {
			//정렬기준이 좋아요 수
			if(sortField.equalsIgnoreCase("recLikes")) {
				pageable = PageRequest.of(page, size);
				
				//JPQL 사용
				if(sortDirection.equalsIgnoreCase("asc")) {
					return recRepository.findByProjectEntity_projPkNumOrderByRecLikesAsc(projNum, pageable)
							.map(RecommendationDto::fromEntity);
				} else {
					return recRepository.findByProjectEntity_projPkNumOrderByRecLikesDesc(projNum, pageable)
							.map(RecommendationDto::fromEntity);
				}
			//정렬기준이 등록일, 조회수
			} else {
				Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(Order.asc(sortField)) : Sort.by(Order.desc(sortField));
				pageable = PageRequest.of(page, size, sort);
				return recRepository.findByProjectEntity_projPkNum(projNum, pageable)
							.map(RecommendationDto::fromEntity);
			}
			
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}
	
	//건의사항 게시글 조회
	@Override
	@Transactional
	public RecommendationDto getRecOne(int projNum, int recNum) {
		
		try {
			
			RecommendationEntity entity = recRepository.findByProjectEntity_projPkNumAndRecPkNum(projNum, recNum);
			
			if(entity == null) {
				throw new ResourceNotFoundException("리소스를 찾을 수 없습니다: 프로젝트 번호 " + projNum + ", 추천 번호 " + recNum);
			}
			
			return RecommendationDto.fromEntity(entity);
		} catch (ResourceNotFoundException e) {
	        throw e;
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
	}
	
	//건의사항 등록
	@Override
	public void addRec(RecommendationForm bean) {
		try {
			RecommendationEntity entity = RecommendationForm.toEntity(bean);
			
			ProjectEntity projectEntity = projRepository.findById(bean.getRec_fk_proj_num())
	                .orElseThrow(() -> new ResourceNotFoundException("프로젝트를 찾을 수 없습니다. 프로젝트 번호 : " + bean.getRec_fk_proj_num()));
	        entity.setProjectEntity(projectEntity);
	        
	        UserEntity userEntity = userRepository.findById(bean.getRec_fk_user_num())
	                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다. 사번 : " + bean.getRec_fk_user_num()));
	        entity.setUserEntity(userEntity);
	        
			entity.setRecRegdate(LocalDateTime.now()); //작성일자는 현재 시간
			
			recRepository.save(entity);
		} catch (ResourceNotFoundException e) {
	        throw e;
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
	}
	
	//건의사항 수정
	@Override
	@Transactional
	public RecommendationDto editRec(int recNum, RecommendationForm bean) {
		try {
			RecommendationEntity entity = RecommendationForm.toEntity(bean);
			// 프로젝트가 존재하지 않으면 예외 처리
	        ProjectEntity projectEntity = projRepository.findById(bean.getRec_fk_proj_num())
	                .orElseThrow(() -> new ResourceNotFoundException("프로젝트를 찾을 수 없습니다. 프로젝트 번호 : " + bean.getRec_fk_proj_num()));
	        entity.setProjectEntity(projectEntity);
	        
	        UserEntity userEntity = userRepository.findById(bean.getRec_fk_user_num())
	                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다. 사번 : " + bean.getRec_fk_user_num()));
	        
	        entity.setUserEntity(userEntity);
	        entity.setReclikesEntities(reclikesRepository.findByRecommendationEntity_RecPkNum(recNum));
			
			return RecommendationDto.fromEntity(recRepository.save(entity));
			
		} catch (ResourceNotFoundException e) {
	        throw e;
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
	}
	
	//건의사항 삭제
	@Override
	@Transactional
	public void dropRec(int recNum) {
		try {
			
			if (!recRepository.existsById(recNum)) {
                throw new ResourceNotFoundException("건의사항을 찾을 수 없습니다. 사번 : " + recNum);
            }
	        
			//건의사항 좋아요 삭제
			reclikesRepository.deleteByRecommendationEntity_RecPkNum(recNum);
			//건의사항 삭제
			recRepository.deleteById(recNum);
		} catch (ResourceNotFoundException e) {
	        throw e;
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
		
	}
	
	//좋아요가 가장 많은 건의사항 게시글
	@Override
	public Page<RecommendationDto> getMostLike(int projNum) {
		try {
			Pageable pageable = PageRequest.of(0, 1); //가장 상단에 위치한 글 1개만 가져오기
			Page<RecommendationDto> list = recRepository.findByProjectEntity_projPkNumOrderByRecLikesDesc(projNum, pageable).map(RecommendationDto::fromEntity);
			return list;
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
		
	}
	
	//조회수
	@Override
	public void addRecView(int recNum, HttpServletRequest request, HttpServletResponse response) {
		//조회수 증가 (페이지 진입 시 사원당 1일 1회 증가)
        
		try {
			HttpSession session = request.getSession();
			String sessionKey = "recView"+recNum;
			Boolean isView = (Boolean)session.getAttribute(sessionKey);
			
			Cookie[] cookies = request.getCookies();
	        boolean hasCookie = false;
	        
	        if (cookies != null) {
	            for (Cookie cookie : cookies) {
	                if (cookie.getName().equals("recView" + recNum)) {
	                	hasCookie  = true;
	                    break;
	                }
	            }
	        }
	        
	        if((isView == null || !isView)&& !hasCookie) {
	        	recRepository.incrementRecView(recNum);
	        	
	        	session.setAttribute(sessionKey, true);
	        	Cookie newCookie = new Cookie("recView"+recNum, "true");
	        	
	        	newCookie.setMaxAge(86400);
	        	newCookie.setHttpOnly(true);
	            newCookie.setPath("/");
	            response.addCookie(newCookie);
	        }
	        
		} catch(Exception e) {
			throw new RuntimeException(e.getMessage());
		}	
	}
	
	//로그인한 유저가 건의사항 좋아요 눌렀는지 확인
	@Override
	public boolean checkReclike(int userNum, int recNum) {
	    try {
	        // 좋아요 여부 확인
	        if( reclikesRepository
	                   .findByUserEntity_UserPkNumAndRecommendationEntity_RecPkNum(userNum, recNum) != null ) {
	        	return true;
	        } else {
	        	return false;
	        }
	    } catch (Exception e) {
	        // 예기치 않은 오류 처리
	        throw new RuntimeException(e.getMessage());
	    }
	}
	
	//건의사항 좋아요 등록
	@Override
	@Transactional
	public void addReclike(int userNum, int recNum) {
		try {
            ReclikesEntity entity = new ReclikesEntity();
            entity.setUserEntity(userRepository.findById(userNum)
            		.orElseThrow(() -> new ResourceNotFoundException("사원을 찾을 수 없습니다. 사번 : " + userNum)));
            entity.setRecommendationEntity(recRepository.findById(recNum)
            		.orElseThrow(() -> new ResourceNotFoundException("건의사항을 찾을 수 없습니다. 건의사항 번호 : " + recNum)));
            reclikesRepository.save(entity);
        } catch (ResourceNotFoundException e) {
	        throw e;
		} catch (Exception e) {
            throw new RuntimeException("Error adding recommendation like: " + e.getMessage(), e);
        }
    }
	
	//건의사항 좋아요 삭제
	@Override
    public void dropReclike(int userNum, int recNum) {
        try {
            ReclikesEntity entity = reclikesRepository.findByUserEntity_UserPkNumAndRecommendationEntity_RecPkNum(userNum, recNum);
            if (entity != null) {
                reclikesRepository.deleteById(entity.getReclikePkNum());
            } else {
            	throw new ResourceNotFoundException("일치하는 데이터가 없습니다.");
            }
        } catch (ResourceNotFoundException e) {
	        throw e;
		} catch (Exception e) {
            throw new RuntimeException("Error removing recommendation like: " + e.getMessage(), e);
        }
    }

}


