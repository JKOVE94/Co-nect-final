import React, { useState, useEffect } from "react";
import { Table } from "rsuite";
import axios from "axios";
import { Card, CardHeader, CardBody } from "reactstrap";

const { Column, HeaderCell, Cell } = Table;

// 평면 데이터를 트리 구조로 변환하는 함수

const TreeTable = (props) => {
  const [editing, setEditing] = useState(null); // 편집 모드를 관리하는 상태
  const [dateValue, setDateValue] = useState(""); // 날짜 값을 관리하는 상태

  const handleDateClick = (rowData, key) => {
    setEditing({ id: rowData.task_pk_num, key });
    setDateValue(rowData[key] || ""); // 날짜 값이 비어 있는 경우 빈 문자열로 설정
  };
  const handleDateChange = (e, rowData, key) => {
    const newValue = e.target.value;
    setDateValue(newValue);
    const updatedData = props.taskdatas.map((task) =>
      task.task_pk_num === rowData.task_pk_num
        ? { ...task, [key]: newValue }
        : task
    );
    props.setTaskdatas(updatedData);
  };

  const handleDateBlur = () => {
    setEditing(null);
    // 여기서 서버로 업데이트된 날짜를 전송할 수 있습니다.
  };
  return (
    <Card>
      <CardHeader>
        <h2 style={{ margin: "0" }}>업무 관리 테이블</h2>
      </CardHeader>
      <CardBody>
        <Table
          isTree
          defaultExpandAllRows
          bordered
          cellBordered
          rowKey="task_pk_num" // task_pk_num을 rowKey로 사용
          height={400}
          data={props.taskdatas}
          expandColumnKey="task_title" // 트리 토글을 표시할 열의 키
          renderTreeToggle={(icon, rowData) => {
            if (rowData.children && rowData.children.length === 0) {
              return null; // 자식이 없는 노드의 경우 토글 버튼을 표시하지 않음
            }
            return icon; // 자식이 있는 노드의 경우 토글 버튼을 표시
          }}
        >
          <Column width={70} fixed>
            <HeaderCell style={{ textAlign: "center" }}>업무번호</HeaderCell>
            <Cell dataKey="task_pk_num" style={{ textAlign: "center" }} />
          </Column>
          <Column flexGrow={1} treeCol>
            <HeaderCell style={{ textAlign: "center" }}>업무명</HeaderCell>
            <Cell dataKey="task_title" />
          </Column>
          <Column width={300}>
            <HeaderCell style={{ textAlign: "center" }}>업무 설명</HeaderCell>
            <Cell dataKey="task_desc" />
          </Column>
          <Column width={90}>
            <HeaderCell style={{ textAlign: "center" }}>담당자</HeaderCell>
            <Cell dataKey="task_user_name" style={{ textAlign: "center" }} />
          </Column>
          <Column width={90}>
            <HeaderCell style={{ textAlign: "center" }}>상태</HeaderCell>
            <Cell dataKey="task_status" style={{ textAlign: "center" }} />
          </Column>
          <Column width={70}>
            <HeaderCell style={{ textAlign: "center" }}>업무순위</HeaderCell>
            <Cell dataKey="task_priority" style={{ textAlign: "center" }} />
          </Column>
          <Column width={160}>
            <HeaderCell style={{ textAlign: "center" }}>생성일</HeaderCell>
            <Cell>
              {(rowData) =>
                editing &&
                editing.id === rowData.task_pk_num &&
                editing.key === "task_created" ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="date"
                      value={dateValue}
                      onChange={(e) =>
                        handleDateChange(e, rowData, "task_created")
                      }
                      onBlur={handleDateBlur}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDateClick(rowData, "task_created")}
                  >
                    <span>{rowData.task_created || "날짜를 입력하세요"}</span>
                  </div>
                )
              }
            </Cell>
          </Column>
          <Column width={160}>
            <HeaderCell style={{ textAlign: "center" }}>마감일</HeaderCell>
            <Cell>
              {(rowData) =>
                editing &&
                editing.id === rowData.task_pk_num &&
                editing.key === "task_enddate" ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="date"
                      value={dateValue}
                      onChange={(e) =>
                        handleDateChange(e, rowData, "task_enddate")
                      }
                      onBlur={handleDateBlur}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDateClick(rowData, "task_enddate")}
                  >
                    <span>{rowData.task_enddate || "날짜를 입력하세요"}</span>
                  </div>
                )
              }
            </Cell>
          </Column>
        </Table>
      </CardBody>
    </Card>
  );
};

export default TreeTable;
