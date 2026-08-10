import { FileUpload } from '../components/forms/FileUpload.jsx';
import { Icon } from '../components/icon/Icon.jsx';

export default {
  title: 'Components/Forms/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

    title: { control: 'text' },
    hint: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    onFiles: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting FileUpload. Portable consumers use styles.css + bundle, not Storybook. `icon` is a composition slot.',
      },
    },
  },
  args: { lang: 'vi', title: 'Attachments', accept: '.pdf,.png', hint: 'PDF or PNG', multiple: false },
};

export const Default = {
  render: (args) => (
    <FileUpload {...args} icon={<Icon name="upload" size="md" />} onFiles={() => {}} />
  ),
};

export const Matrix = {
  name: 'Matrix / Accept',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <FileUpload {...args} title="PDF" accept=".pdf" hint="Documents only" onFiles={() => {}} />
      <FileUpload
        {...args}
        title="Images"
        accept=".png,.jpg"
        hint="PNG or JPG"
        icon={<Icon name="upload" size="md" />}
        multiple
        onFiles={() => {}}
      />
    </div>
  ),
};
