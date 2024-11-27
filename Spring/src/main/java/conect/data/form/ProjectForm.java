package conect.data.form;

import conect.data.entity.ProjectEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ProjectForm {
    private int proj_pk_num;
    private String proj_name;
    private String proj_desc;
    private Date proj_startdate;
    private Date proj_enddate;
    private String proj_status;
    private String proj_members;
    private Date proj_created;
    private Date proj_updated;
    private String proj_import;
    private String proj_tag;
    private String proj_tagcol;
    private String proj_icon;

    public ProjectEntity toEntity() {
        ProjectEntity entity = new ProjectEntity();
        entity.setProjPkNum(this.proj_pk_num);
        entity.setProjName(this.proj_name);
        entity.setProjDesc(this.proj_desc);
        entity.setProjStartDate(this.proj_startdate);
        entity.setProjEndDate(this.proj_enddate);
        entity.setProjStatus(this.proj_status);
        entity.setProjMembers(this.proj_members);
        entity.setProjCreated(this.proj_created);
        entity.setProjUpdated(this.proj_updated);
        entity.setProjImport(this.proj_import);
        entity.setProjTag(this.proj_tag);
        entity.setProjTagCol(this.proj_tagcol);
        entity.setProjIcon(this.proj_icon);
        return entity;
    }
}