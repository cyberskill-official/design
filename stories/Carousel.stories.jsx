import { Carousel } from '../components/data/Carousel.jsx';

export default {
  title: 'Components/Data/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "startIndex": {
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

export const Default = { render: (args) => (<Carousel label="Demo" {...args}><div style={{ padding: 24 }}>Slide one</div><div style={{ padding: 24 }}>Slide two</div></Carousel>) };

export const Matrix = {
  name: 'Matrix / Slides',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Carousel label="One slide"><div style={{ padding: 20 }}>Only</div></Carousel>
      <Carousel label="Three slides">
        <div style={{ padding: 20 }}>One</div>
        <div style={{ padding: 20 }}>Two</div>
        <div style={{ padding: 20 }}>Three</div>
      </Carousel>
    </div>
  ),
};
