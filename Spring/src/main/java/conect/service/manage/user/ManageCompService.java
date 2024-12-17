package conect.service.manage.user;

import conect.data.dto.CompanyDto;
import conect.data.form.CompanyForm;

public interface ManageCompService {
    CompanyDto getCompanyInfo(int compno);
    void updateCompanyInfo(CompanyForm form, int compNum);
}
