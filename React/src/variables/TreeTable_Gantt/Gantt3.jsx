import React from "react";
import { Table } from "rsuite";
import { Card, CardHeader, CardBody } from "reactstrap";
import "rsuite/dist/rsuite-no-reset.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart } from "react-google-charts";

const { Column, ColumnGroup, HeaderCell, Cell } = Table;

const Gantt3 = (props) => {
  const today = new Date();
  const year = today.getFullYear();
  const taskdatas = props.taskdatas;

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
              height: "50px", // 각 셀의 높이를 설정
            }}
          />
        );
      },
    };
  });

  const ganttColumns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  const ganttRows = [
    [
      "2014Spring",
      "Spring 2014",
      "spring",
      new Date(2014, 2, 22),
      new Date(2014, 5, 20),
      null,
      100,
      null,
    ],
    [
      "2014Summer",
      "Summer 2014",
      "summer",
      new Date(2014, 5, 21),
      new Date(2014, 8, 20),
      null,
      100,
      null,
    ],
    [
      "2014Autumn",
      "Autumn 2014",
      "autumn",
      new Date(2014, 8, 21),
      new Date(2014, 11, 20),
      null,
      100,
      null,
    ],
    [
      "2014Winter",
      "Winter 2014",
      "winter",
      new Date(2014, 11, 21),
      new Date(2015, 2, 21),
      null,
      100,
      null,
    ],
    [
      "2015Spring",
      "Spring 2015",
      "spring",
      new Date(2015, 2, 22),
      new Date(2015, 5, 20),
      null,
      50,
      null,
    ],
    [
      "2015Summer",
      "Summer 2015",
      "summer",
      new Date(2015, 5, 21),
      new Date(2015, 8, 20),
      null,
      0,
      null,
    ],
    [
      "2015Autumn",
      "Autumn 2015",
      "autumn",
      new Date(2015, 8, 21),
      new Date(2015, 11, 20),
      null,
      0,
      null,
    ],
    [
      "2015Winter",
      "Winter 2015",
      "winter",
      new Date(2015, 11, 21),
      new Date(2016, 2, 21),
      null,
      0,
      null,
    ],
    [
      "Football",
      "Football Season",
      "sports",
      new Date(2014, 8, 4),
      new Date(2015, 1, 1),
      null,
      100,
      null,
    ],
    [
      "Baseball",
      "Baseball Season",
      "sports",
      new Date(2015, 2, 31),
      new Date(2015, 9, 20),
      null,
      14,
      null,
    ],
    [
      "Basketball",
      "Basketball Season",
      "sports",
      new Date(2014, 9, 28),
      new Date(2015, 5, 20),
      null,
      86,
      null,
    ],
    [
      "Hockey",
      "Hockey Season",
      "sports",
      new Date(2014, 9, 8),
      new Date(2015, 5, 21),
      null,
      89,
      null,
    ],
  ];

  const ganttData = [ganttColumns, ...ganttRows];

  const ganttOptions = {
    height: 400,
    gantt: {
      trackHeight: 30,
    },
  };

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
          data={taskdatas}
          rowHeight={50} // 각 행의 높이를 설정
        >
          <Column width={300} fixed>
            <HeaderCell style={{ textAlign: "center" }}>업무명</HeaderCell>
            <Cell
              dataKey="task_title"
              style={{ padding: "5px 0", height: "50px" }}
            />
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

          <Column width={1000} align="center">
            <HeaderCell>간트 차트</HeaderCell>
            <Cell>
              {() => (
                <div style={{ width: "100%", height: "100%" }}>
                  <Chart
                    chartType="Gantt"
                    width="100%"
                    height="100%"
                    data={ganttData}
                    options={ganttOptions}
                  />
                </div>
              )}
            </Cell>
          </Column>
        </Table>
      </CardBody>
    </Card>
  );
};

export default Gantt3;
