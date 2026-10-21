import { BackTop } from '../components/navigation/BackTop.jsx';

export default {
  title: 'Components/Navigation/BackTop',
  component: BackTop,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "threshold": {
    "control": "number"
  },
  "label": {
    "control": "text"
  },
  "lang": {
    "control": "text"
  }
},
};

export const Default = { render: (args) => (<div tabIndex={0} role="region" aria-label="Scrollable BackTop example" style={{ height: 200, overflow: 'auto' }}><p style={{ height: 400 }}>Scroll…</p><BackTop  {...args}/></div>) };

export const Matrix = {
  name: 'Matrix / Scroll host',
  render: () => (
    <div tabIndex={0} role="region" aria-label="Scrollable BackTop matrix" style={{ height: 160, overflow: 'auto', border: '1px solid var(--cs-color-border-default)' }}>
      <p style={{ height: 400, margin: 0, padding: 12 }}>Scroll down for BackTop</p>
      <BackTop />
    </div>
  ),
};
