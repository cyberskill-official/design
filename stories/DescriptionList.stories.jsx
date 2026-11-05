import { DescriptionList } from '../components/data/DescriptionList.jsx';

export default {
  title: 'Components/Data/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
  },
  args: { items: [{ term: 'Element', value: 'Thổ · studio' }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Items',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <DescriptionList {...args} items={[{ term: 'A', value: '1' }]} />
      <DescriptionList {...args} items={[{ term: 'A', value: '1' }, { term: 'B', value: '2' }]} />
    </div>
  ),
};

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioDescriptionListEmpty = {
  name: "DescriptionList: Empty collection",
  args: {
  "items": []
},
  render: args => renderComponentScenario("DescriptionList--empty",args),
  play: ({canvasElement}) => playComponentScenario("DescriptionList--empty",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
