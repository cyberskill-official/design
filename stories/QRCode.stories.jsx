import { QRCode } from '../components/data/QRCode.jsx';

export default {
  title: 'Components/Data/QRCode',
  component: QRCode,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "value": {
    "control": "text"
  },
  "size": {
    "control": "number"
  },
  "color": {
    "control": "text"
  },
  "label": {
    "control": "text"
  }
},
  args: { value: 'https://design.cyberskill.world', size: 128 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Values',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <QRCode {...args} value="https://design.cyberskill.world" />
      <QRCode {...args} value="https://cyberskill.world" />
    </div>
  ),
};

export const AllSizes = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
      <QRCode {...args} value="https://design.cyberskill.world" size={96} />
      <QRCode {...args} value="https://design.cyberskill.world" size={128} />
      <QRCode {...args} value="https://design.cyberskill.world" size={144} />
    </div>
  ),
};
