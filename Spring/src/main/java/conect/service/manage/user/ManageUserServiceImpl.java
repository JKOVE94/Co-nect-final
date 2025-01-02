package conect.service.manage.user;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import conect.data.dto.CompanyDto;
import conect.data.dto.UserDto;
import conect.data.entity.UserEntity;
import conect.data.form.UserForm;
import conect.data.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManageUserServiceImpl implements ManageUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    // GCP Storage 세팅
    @Value("${spring.cloud.gcp.storage.credentials.location}")
    private String keyFileName;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    @Override
    public String saveImage(UserForm form) throws IOException {
        InputStream keyFile = null;
        String imgUrl = "";
        System.out.println("keyFileName : " + keyFileName);
        try {
            keyFile = ResourceUtils.getURL(keyFileName).openStream();

            String fileName = "emp_pic/" + form.getUser_fk_comp_num() + "_" + form.getUser_pk_num();
            String ext = form.getUser_picfile().getContentType();

            Storage storage = StorageOptions.newBuilder()
                    .setCredentials(GoogleCredentials.fromStream(keyFile))
                    .build()
                    .getService();

            imgUrl = "https://storage.googleapis.com/" + bucketName + "/" + fileName;

            if (form.getUser_picfile().isEmpty()) {
                imgUrl = null;
            } else {
                BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName)
                        .setContentType(ext).build();

                Blob blob = storage.create(blobInfo, form.getUser_picfile().getInputStream());
            }
        } finally {
            if (keyFile != null) {
                keyFile.close();
            }
        }
        return imgUrl;
    }

    @Override
    @Transactional
    public boolean deleteImage(int user_pk_num) {
        UserEntity user = userRepository.findById(user_pk_num).get();
        String projectId = "favorable-order-443405-t7";
        String bucketName = "co-nect";
        String objectName = "emp_pic/" + user.getCompanyEntity().getCompPkNum() + "_" + user.getUserPkNum();
        System.out.println("objectName : " + objectName);
        Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
        Blob blob = storage.get(bucketName, objectName);
        if (blob == null) {
            System.out.println("The object " + objectName + " wasn't found in " + bucketName);
            return false;
        }
        BlobId idWithGeneration = blob.getBlobId();
        storage.delete(idWithGeneration);
        System.out.println("Object " + objectName + " was deleted from " + bucketName);
        return true;
    }

    @Override
    public boolean insertUser(UserForm form) {
        // 유저를 등록하는 메소드
        String imgUrl = null;
        try {
            imgUrl = saveImage(form);
            UserEntity entity = UserForm.toEntity(form);
            entity.setCompanyEntity(companyRepository.findById(form.getUser_fk_comp_num()).get());
            entity.setUserPic(imgUrl); // 이미지 경로 저장 (Google Cloude Storage)
            userRepository.save(entity);
            return true;
        } catch (Exception e) {
            System.out.println("insertUser err : " + e);
            return false;
        }
    }

    @Override
    public List<UserDto> getUserAll(int comp_pk_num) {
        // 모든 직원의 정보를 가져오는 메소드
        return userRepository.findAll().stream()
                .filter(user -> user.getCompanyEntity().getCompPkNum() == comp_pk_num)
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserOne(int userno, int comp_pk_num) {
        // 한명의 직원의 정보를 가져오는 메소드
        // System.out.println("userno : " + userno);
        // System.out.println("comp_pk_num" + comp_pk_num);
        return UserDto.fromEntity(userRepository.findUserByUserPkNumAndCompPkNum(userno, comp_pk_num));
    }

    @Override
    public List<UserDto> getLockedUserAll(int comp_pk_num) {
        // 잠긴 계정의 정보를 가져오는 메소드
        return userRepository.findLockedUser().stream()
                .filter(user -> user.getCompanyEntity().getCompPkNum() == comp_pk_num)
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Modifying
    @Override
    public boolean unlockUser(int comp_pk_num, Integer[] usernos) {
        // 잠긴 계정을 풀어주는 메소드
        try {
            for (int userno : usernos) {
                UserEntity entity = userRepository.findUserByUserPkNumAndCompPkNum(userno, comp_pk_num);
                entity.setUserLocked(false);
                userRepository.save(entity);
            }
            return true;
        } catch (Exception e) {
            System.out.println("unlockUser err :" + e);
            return false;
        }
    }

    @Override
    @Transactional
    public boolean updateUser(UserForm form) {
        String imgUrl = null;
        try {
            UserEntity entity = userRepository.findById(form.getUser_pk_num()).get();
            if (form.getUser_picfile() != null) {
                imgUrl = saveImage(form);
                entity.setUserPic(imgUrl); // 이미지 경로 저장 (Google Cloude Storage)
            }
            entity.setCompanyEntity(companyRepository.findById(form.getUser_fk_comp_num()).get());
            if(form.getUser_pw() != null) {
                entity.setUserPw(form.getUser_pw());
                entity.setUserIstemppw(false);
            }
            if(form.getUser_author() > 0) {
                entity.setUserAuthor(form.getUser_author());
            }
            if(form.getUser_id() != null) {
                entity.setUserId(form.getUser_id());
            }
            if(form.getUser_lastlogin() != null) {
                entity.setUserLastlogin(form.getUser_lastlogin());
            }
            if(form.getUser_mail() != null) {
                entity.setUserMail(form.getUser_mail());
            }
            if(form.getUser_name() != null) {
                entity.setUserName(form.getUser_name());
            }

            userRepository.save(entity);
            return true;
        } catch (Exception e) {
            System.out.println("updateUser err : " + e);
            return false;
        }
    }

    @Override
    public boolean deleteUser(int comp_pk_num, int user_pk_num) {
        // 유저를 삭제하는 메소드
        try {
            UserEntity user = userRepository.findUserByUserPkNumAndCompPkNum(user_pk_num, comp_pk_num);
            userRepository.deleteById(user.getUserPkNum());

        } catch (Exception e) {
            System.out.println("deleteUser err : " + e);
        }
        return false;
    }

    @Override
    public boolean resetPassword(int comp_pk_num, int userno) {
        try {
            UserEntity entity = userRepository.findUserByUserPkNumAndCompPkNum(userno, comp_pk_num);
            entity.setUserPw("1234");
            entity.setUserIstemppw(true);
            userRepository.save(entity);
            return true;
        } catch (Exception e) {
            System.out.println("resetPassword err : " + e);
            return false;
        }
    }
}
