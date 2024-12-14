package conect.data.entity;

import java.io.Serializable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@EqualsAndHashCode
public class ShareId implements Serializable {
    private TodoEntity todo; // 컬럼명에 맞게 정의
    private int shareUser;
}
