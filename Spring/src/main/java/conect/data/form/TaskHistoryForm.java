package conect.data.form;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class TaskhistoryForm {
    @NotBlank(message = "이전 값은 필수입니다.")
    private String taskhisBeforevalue;

    @NotBlank(message = "변경 후 값은 필수입니다.")
    private String taskhisAftervalue;

    @NotBlank(message = "변경 유형은 필수입니다.")
    private String taskhisType;

    @NotNull(message = "회사 번호는 필수입니다.")
    private Integer taskhisFkCompNum;

    @NotNull(message = "사용자 번호는 필수입니다.")
    private Integer taskhisFkUserNum;

    @NotNull(message = "태스크 번호는 필수입니다.")
    private Integer taskhisFkTaskNum;
}
