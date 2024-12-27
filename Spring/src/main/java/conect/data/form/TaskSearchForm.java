package conect.data.form;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TaskSearchForm {
    private int projectNum;
    private String searchType;
    private String searchValue;
}
