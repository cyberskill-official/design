import { List, ListItem } from '../components/data/List.jsx';

export default {
  title: 'Components/Data/List',
  component: List,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "lead": {
    "control": "object"
  },
  "title": {
    "control": "object"
  },
  "subtitle": {
    "control": "object"
  },
  "trail": {
    "control": "object"
  }
},
};

export const Default = { render: (args) => (<List {...args}><ListItem>First wish</ListItem><ListItem>Second wish</ListItem></List>) };

export const Matrix = {
  name: 'Matrix / Density',
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
      <List><ListItem>One</ListItem><ListItem>Two</ListItem></List>
      <List><ListItem>Alpha</ListItem><ListItem>Beta</ListItem><ListItem>Gamma</ListItem></List>
    </div>
  ),
};
