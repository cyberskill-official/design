import { ButtonGroup } from '../components/button/ButtonGroup.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Button/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "label": {
    "control": "text"
  }
},
};

export const Default = { render: (args) => (<ButtonGroup {...args}><Button variant="secondary">Cancel</Button><Button>Confirm</Button></ButtonGroup>) };

export const Matrix = {
  name: 'Matrix / Sizes',
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <ButtonGroup><Button size="sm">A</Button><Button size="sm" variant="secondary">B</Button></ButtonGroup>
      <ButtonGroup><Button>A</Button><Button variant="secondary">B</Button></ButtonGroup>
    </div>
  ),
};
