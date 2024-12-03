export const mockTreeData = ({ limits, labels, getRowData }) => {
  const createNode = (layer, parentId = null) => {
    const node = {
      ...getRowData(),
      label: labels(layer),
      parentId,
      children: [],
    };

    if (layer < limits.length - 1) {
      for (let i = 0; i < limits[layer]; i++) {
        node.children.push(createNode(layer + 1, node.id));
      }
    }s

    return node;
  };

  const data = [];
  for (let i = 0; i < limits[0]; i++) {
    data.push(createNode(0));
  }

  return data;
};
