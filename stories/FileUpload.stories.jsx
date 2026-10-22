import { FileUpload } from '../components/forms/FileUpload.jsx';
import { Icon } from '../components/icon/Icon.jsx';

export default {
  title: 'Components/Forms/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    lang: { control: 'select', options: ['en', 'vi'] },

    title: { control: 'text' },
    hint: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    onFiles: { control: false },
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
