import { FileUpload } from '../components/forms/FileUpload.jsx';

export default {
  title: 'Components/Forms/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    hint: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting FileUpload. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { title: 'Attachments', accept: '.pdf,.png', hint: 'PDF or PNG' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Accept',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <FileUpload {...args} title="PDF" accept=".pdf" hint="Documents only" />
      <FileUpload {...args} title="Images" accept=".png,.jpg" hint="PNG or JPG" />
    </div>
  ),
};
