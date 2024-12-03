import React from "react";
import { Table } from "rsuite";
import { Card, CardHeader, CardBody } from "reactstrap";
import "rsuite/dist/rsuite-no-reset.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

const { Column, ColumnGroup, HeaderCell, Cell } = Table;

const Gantt = (props) => {
  const today = new Date();
  const year = today.getFullYear();
  const data = props.taskdatas;

  // 현재 월을 기준으로 12개월의 헤더를 생성합니다.
  const currentMonth = today.getMonth();
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(year, currentMonth + i);
    return {
      month: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
      lastDay: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
    };
  });

  const columns = Array.from({ length: 31 }).map((_, index) => {
    return {
      HeaderCell: (props) => {
        return <HeaderCell {...props}>{index + 1}</HeaderCell>;
      },
      Cell: ({ rowData, depth, ...rest }) => {
        const colors = ["#c8f0c7", "#4cb04f", "#0f9119"];
        const startDate = new Date(rowData.task_startdate);
        const endDate = new Date(rowData.task_deadline);
        const day = index + 1;
        const inRange = startDate.getDate() <= day && day <= endDate.getDate();

        return (
          <Cell
            {...rest}
            depth={depth}
            style={{
              backgroundColor: inRange ? colors[depth] : "transparent",
            }}
          />
        );
      },
    };
  });

  return (
    <Card>
      <CardHeader>
        <h2 style={{ margin: "0" }}>업무 관리 테이블</h2>
      </CardHeader>
      <CardBody style={{ overflowX: "auto" }}>
        <Table
          isTree
          defaultExpandAllRows
          bordered
          cellBordered
          rowKey="task_pk_num"
          autoHeight
          data={data}
          rowHeight={30}
        >
          <Column width={300} fixed>
            <HeaderCell style={{ textAlign: "center" }}>업무명</HeaderCell>
            <Cell dataKey="task_title" style={{ padding: "5px 0" }} />
          </Column>

          {months.map((monthData, monthIndex) => (
            <ColumnGroup
              key={monthIndex}
              header={<HeaderCell>{monthData.month}</HeaderCell>}
            >
              {Array.from({ length: monthData.lastDay }).map((_, dayIndex) => {
                const { HeaderCell, Cell } = columns[dayIndex];
                return (
                  <Column key={dayIndex} width={40} align="center">
                    <HeaderCell />
                    <Cell />
                  </Column>
                );
              })}
            </ColumnGroup>
          ))}
        </Table>
      </CardBody>
    </Card>
  );
};

export default Gantt;
