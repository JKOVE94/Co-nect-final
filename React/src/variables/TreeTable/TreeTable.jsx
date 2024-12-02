import { Table } from "rsuite";
import { faker } from "@faker-js/faker";
import { mockTreeData } from "./mock";
import "rsuite/dist/rsuite-no-reset.min.css";

const { Column, HeaderCell, Cell } = Table;
const data = mockTreeData({
  limits: [3, 3, 3],
  labels: (layer) => {
    if (layer === 0) {
      return faker.vehicle.manufacturer();
    } else if (layer === 1) {
      return faker.vehicle.fuel();
    }
    return faker.vehicle.vehicle();
  },
  getRowData: () => ({
    id: faker.string.numeric(5),
    price: faker.commerce.price({
      min: 10000,
      max: 1000000,
      dec: 0,
      symbol: "$",
    }),
    rating: faker.finance.amount({ min: 2, max: 5 }),
  }),
});

const TreeTable = () => {
  return (
    <Table
      isTree
      defaultExpandAllRows
      bordered
      cellBordered
      rowKey="id"
      height={400}
      data={data}
      /** shouldUpdateScroll: whether to update the scroll bar after data update **/
      shouldUpdateScroll={false}
      onExpandChange={(isOpen, rowData) => {
        console.log(isOpen, rowData);
      }}
    >
      <Column width={100}>
        <HeaderCell>업무번호</HeaderCell>
        <Cell dataKey="id" />
      </Column>
      <Column flexGrow={1} treeCol>
        <HeaderCell>업무명</HeaderCell>
        <Cell dataKey="label" />
      </Column>
      <Column width={180}>
        <HeaderCell>담당자</HeaderCell>
        <Cell></Cell>
      </Column>
      <Column width={180}>
        <HeaderCell>상태</HeaderCell>
        <Cell></Cell>
      </Column>
      <Column width={100}>
        <HeaderCell>업무순위</HeaderCell>
        <Cell dataKey="price" />
      </Column>
      <Column width={100}>
        <HeaderCell>마감일</HeaderCell>
        <Cell dataKey="price" />
      </Column>
    </Table>
  );
};

export default TreeTable;
