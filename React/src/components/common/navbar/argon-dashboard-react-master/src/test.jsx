import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

const Test = () => {
    return(
        <Sidebar>
  <Menu
    menuItemStyles={{
      button: ({ level, active, disabled }) => {
        // only apply styles on first level elements of the tree
        if (level === 0)
          return {
            color: disabled ? '#f5d9ff' : '#d359ff',
            backgroundColor: active ? '#eecef9' : undefined,
          };
      },
    }}
  >
    //...
  </Menu>
</Sidebar>

    )
}