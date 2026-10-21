import { Comment } from '../components/data/Comment.jsx';

export default {
  title: 'Components/Data/Comment',
  component: Comment,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "avatar": {
    "control": "object"
  },
  "author": {
    "control": "object"
  },
  "meta": {
    "control": "object"
  },
  "actions": {
    "control": "object"
  },
  "replies": {
    "control": "object"
  },
  "lang": {
    "control": "text"
  }
},
  args: { author: 'Lumi', children: 'Looks on-brand.' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Authors',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Comment {...args} author="Lumi">Hello</Comment>
      <Comment {...args} author="Stephen">Ship it</Comment>
    </div>
  ),
};
