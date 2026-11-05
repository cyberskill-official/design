import { Breadcrumb } from '../components/navigation/Breadcrumb.jsx';

export default {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
  "items": {
    "control": "object"
  }
},
  args: { items: [{ href: '#', label: 'Home' }, { label: 'Button' }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Depth',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Breadcrumb {...args} items={[{ href: '#', label: 'Home' }, { label: 'Here' }]} />
      <Breadcrumb {...args} items={[{ href: '#', label: 'Home' }, { href: '#', label: 'Components' }, { label: 'Breadcrumb' }]} />
    </div>
  ),
};

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioBreadcrumbEmpty = {
  name: "Breadcrumb: Empty collection",
  args: {
  "items": []
},
  render: args => renderComponentScenario("Breadcrumb--empty",args),
  play: ({canvasElement}) => playComponentScenario("Breadcrumb--empty",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
