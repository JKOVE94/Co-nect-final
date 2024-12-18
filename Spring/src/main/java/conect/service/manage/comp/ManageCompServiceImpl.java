package conect.service.manage.comp;

import conect.data.dto.CompanyDto;
import conect.data.entity.CompanyEntity;
import conect.data.form.CompanyForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ManageCompServiceImpl implements ManageCompService{

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public CompanyDto getCompanyInfo(int compno) {
        CompanyDto dto = CompanyDto.fromEntity(companyRepository.findById(compno).get());
        dto.setComp_totalEmp(userRepository.findUserByCompany(compno).size());
        dto.setComp_totalProject(projectRepository.findByProjCompNum(compno).size());
        dto.setComp_completeProject(projectRepository.findByProjCompNumAndProjStatus(compno, "종료").size());
        return dto;
    }

    @Override
    public void updateCompanyInfo(CompanyForm form, int compNum) {
        CompanyEntity entity = companyRepository.findById(compNum).get();
        entity.setCompName(form.getComp_name());
//        entity.setCompPic(form.getComp_pic());
        entity.setCompAddr(form.getComp_addr());
        entity.setCompTel(form.getComp_tel());
        entity.setCompWebsite(form.getComp_website());
        companyRepository.save(entity);
    }
}
