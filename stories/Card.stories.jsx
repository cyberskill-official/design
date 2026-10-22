import { Card, CardHeader, CardBody, CardFooter } from '../components/data/Card.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Data/Card',
  component: Card,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "interactive": {
    "control": "boolean"
  },
  "flat": {
    "control": "boolean"
  }
},
};

export const Default = { render: (args) => (<Card {...args}><CardHeader>Wish</CardHeader><CardBody>Turn Your Will Into Real</CardBody><CardFooter><Button size="sm">Open</Button></CardFooter></Card>) };

export const Matrix = {
  name: 'Matrix / Surfaces',
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
      <Card><CardHeader title="Default" /><CardBody>Body</CardBody></Card>
      <Card flat><CardHeader title="Flat" /><CardBody>Body</CardBody></Card>
      <Card interactive><CardHeader title="Interactive" /><CardBody>Body</CardBody></Card>
    </div>
  ),
};
