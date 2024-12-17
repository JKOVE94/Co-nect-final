import React, { useState, useEffect } from "react";
import { Table } from "rsuite";
import { Card, CardHeader, CardBody } from "reactstrap";

const { Column, HeaderCell, Cell } = Table;

const TreeTable = (props) => {
  const [editing, setEditing] = useState(null); // 편집 모드를 관리하는 상태
  const [dateValue, setDateValue] = useState(""); // 날짜 값을 관리하는 상태

  const convertToTree = (data) => {
    const map = {}; // task_pk_num을 key로 사용하여 taskdatas를 저장
    const roots = []; //루트 노드 저장 (부모 노드)

    data.forEach((item) => {
      map[item.task_pk_num] = { ...item, children: [] };
    });

    data.forEach((item) => {
      if (item.task_fk_task_num) {
        if (!map[item.task_fk_task_num].children) {
          map[item.task_fk_task_num].children = [];
        }
        map[item.task_fk_task_num].children.push(map[item.task_pk_num]);
      } else {
        roots.push(map[item.task_pk_num]);
      }
    });
    return roots;
  };

  const handleDateClick = (rowData, key) => {
    setEditing({ id: rowData.task_pk_num, key });
    setDateValue(rowData[key] || ""); // 날짜 값이 비어 있는 경우 빈 문자열로 설정
  };

  const handleDateChange = (e, rowData, key) => {
    const newValue = e.target.value;
    setDateValue(newValue);
    const updatedData = {
      ...rowData,
      [key]: newValue,
      task_updated: new Date().toISOString().split("T")[0], // ISO 8601 형식의 날짜 문자열   "2011-10-05T14:48:00.000Z" 그래서 split("T")[0]을 사용하여 날짜만 가져옴
    };
    props.setUpdatedData({ tree: updatedData });
    const updatedTaskdatas = props.taskdatas.map((task) =>
      task.task_pk_num === rowData.task_pk_num ? updatedData : task
    );
    props.setTaskdatas(updatedTaskdatas);
  };

  useEffect(() => {
    convertToTree(props.taskdatas);
  }, [props.taskdatas]);

  const handleDateBlur = () => {
    setEditing(null);
  };

  // 삭제 버튼 클릭 시 실행되는 함수
  const handleDeleteClick = (task_pk_num) => {
    props.setType("delete");
    props.handleShowM();
    props.setDeleteTarget(task_pk_num);
  };

  const treeData = convertToTree(props.taskdatas);

  return (
    <>
      <Table
        isTree
        defaultExpandAllRows
        bordered
        cellBordered
        rowKey="task_pk_num" // task_pk_num을 rowKey로 사용
        height={400}
        data={treeData}
        expandColumnKey="task_title" // 트리 토글을 표시할 열의 키
        renderTreeToggle={(icon, rowData) => {
          if (!rowData.children || rowData.children.length === 0) {
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
        <Column width={270}>
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
              editing.key === "task_startdate" ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="date"
                    value={dateValue}
                    onChange={(e) =>
                      handleDateChange(e, rowData, "task_startdate")
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
                  onClick={() => handleDateClick(rowData, "task_startdate")}
                >
                  <span>{rowData.task_startdate || "날짜를 입력하세요"}</span>
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
              editing.key === "task_deadline" ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="date"
                    value={dateValue}
                    onChange={(e) =>
                      handleDateChange(e, rowData, "task_deadline")
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
                  onClick={() => handleDateClick(rowData, "task_deadline")}
                >
                  <span>{rowData.task_deadline || "날짜를 입력하세요"}</span>
                </div>
              )
            }
          </Cell>
        </Column>
        <Column width={70}>
          <HeaderCell style={{ textAlign: "center" }}>삭제</HeaderCell>
          <Cell
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {(rowData) => (
              <div style={{ textAlign: "center" }}>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteClick(rowData.task_pk_num)}
                  style={{ fontSize: "0.8em" }}
                >
                  삭제
                </button>
              </div>
            )}
          </Cell>
        </Column>
      </Table>
    </>
  );
};

export default TreeTable;
