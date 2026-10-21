import { Sidebar, NavItem } from '../components/navigation/Sidebar.jsx';

export default {
  title: 'Components/Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "label": {
    "control": "text"
  }
},
};

export const Default = { render: (args) => (<Sidebar label="App" {...args}><NavItem active>Overview</NavItem><NavItem>Health</NavItem><NavItem>Tokens</NavItem></Sidebar>) };

export const Matrix = {
  name: 'Matrix / Active item',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Sidebar label="App">
        <NavItem active>Overview</NavItem>
        <NavItem>Health</NavItem>
      </Sidebar>
      <Sidebar label="App">
        <NavItem>Overview</NavItem>
        <NavItem active>Tokens</NavItem>
      </Sidebar>
    </div>
  ),
};
