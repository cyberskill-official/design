// Stress-test screens for the quality benchmark (npm run benchmark). Each story packs one hard case across every
// component it applies to; the benchmark finds what to measure through the data-bench-* attributes.
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Plus, Trash } from '@phosphor-icons/react';
import {
  Accordion, AccordionItem, AccordionPanel, AccordionTrigger, Alert, Autocomplete, AvatarUpload, Badge, Breadcrumbs, Button, Card, CardContent,
  CardDescription, CardHeader, CardTitle, Checkbox, CheckboxGroup, ComboboxField, EmptyState, Field, FileUpload, MultiSelectField,
  NumberField, OtpField, Pagination, PasswordField, Popover, PopoverContent, PopoverTrigger, Prose, Radio, RadioGroup, SearchField,
  SegmentedControl, SelectField, Slider, Stat, Stepper, Switch, Tabs, TabsList, TabsPanel, TabsTab, Tag, TagInput, TextField, Textarea,
  ThemeScope, Toggle,
} from '../react';
import { DatePicker, DateRangePicker, DateTimePicker, TimePicker } from '../date';

const meta = { title: 'Benchmark', tags: ['!autodocs'], parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};
const Row = ({ children, label }: { children: ReactNode; label: string }) => (
  <section aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>{children}</section>
);

/* ---------- Vietnamese: stacked diacritics above (Ẫ Ỗ Ữ Ẵ) and below (ặ ọ ỵ) the line ---------- */
const VI = 'Ổn định Ữ Ẫ Ẵ ặ ọ ỵ';
const viItems = [
  { value: 'ha-noi', label: 'Hà Nội — Ữ Ỗ ặ ỵ' },
  { value: 'ho-chi-minh', label: 'Hồ Chí Minh' },
];

/** Every text-bearing component at every size with stacked Vietnamese marks. Nothing may clip them. */
export const VietnameseText: Story = {
  render: () => (
    <div lang="vi" data-bench="vi">
      <Row label="Nút">
        {(['sm', 'md', 'lg'] as const).map(size => <Button key={size} size={size}>{VI}</Button>)}
        <Button variant="secondary" size="sm" iconStart={<Plus />}>Thêm ỗ ặ</Button>
      </Row>
      <Row label="Nhãn">
        <Badge size="sm">{VI}</Badge>
        <Badge tone="success">Ổn định ặ</Badge>
        <Badge tone="danger" variant="solid">Lỗi Ữ ỵ</Badge>
        <Tag>Thẻ Ữ ỵ</Tag>
        <Tag onRemove={noop} removeLabel="Xoá thẻ">Đã gỡ Ỗ ọ</Tag>
      </Row>
      <Row label="Ô nhập">
        {(['sm', 'md', 'lg'] as const).map(size => <TextField key={size} size={size} label={`Họ tên ${size}`} defaultValue="Nguyễn Thị Ữ Ẫ ặ ỵ" />)}
        <TextField label="Gợi ý" placeholder="Ví dụ: Phường Ỗ Ữ ặ ỵ" />
        <Textarea label="Ghi chú" defaultValue={`${VI}\n${VI}`} rows={2} />
        <SelectField label="Tỉnh thành" items={viItems} defaultValue="ha-noi" />
        <ComboboxField label="Khu vực" items={viItems} defaultValue="ha-noi" />
        <MultiSelectField label="Kỹ năng" items={viItems} defaultValue={['ha-noi']} />
        <SearchField label="Tìm kiếm" defaultValue="Ữ Ẫ ặ ỵ" />
        {(['sm', 'md', 'lg'] as const).map(size => <PasswordField key={size} size={size} label={`Mật khẩu ${size}`} defaultValue="Ữ Ẫ ặ ỵ" defaultVisible hidePasswordLabel="Ẩn mật khẩu" />)}
        {(['sm', 'md', 'lg'] as const).map(size => <TagInput key={size} size={size} label={`Từ khoá ${size}`} defaultValue={['Ổn định Ữ', 'Ẵ ặ ọ ỵ']} removeLabel={t => `Xoá ${t}`} />)}
      </Row>
      <Row label="Lựa chọn">
        <Checkbox label={VI} defaultChecked />
        <Switch label="Tự động Ữ ỵ" defaultChecked />
        <RadioGroup label="Chu kỳ" defaultValue="a"><Radio value="a" label="Hằng tháng Ữ ỵ" /><Radio value="b" label="Hằng năm Ặ ọ" /></RadioGroup>
        <SegmentedControl label="Chế độ xem" items={[{ value: 'a', label: 'Danh sách Ữ' }, { value: 'b', label: 'Bảng ặ ỵ' }]} defaultValue="a" />
        {(['sm', 'md', 'lg'] as const).map(size => <Toggle key={size} size={size} defaultPressed={size === 'md'}>Ghim Ữ Ẫ ỵ</Toggle>)}
      </Row>
      <Row label="Cấu trúc">
        <div style={{ width: 320 }}>
          <Accordion defaultValue={['a']}>
            <AccordionItem value="a"><AccordionTrigger>Hỏi đáp Ữ Ẫ ặ ỵ</AccordionTrigger><AccordionPanel>Ổn định ặ ọ ỵ</AccordionPanel></AccordionItem>
          </Accordion>
        </div>
        <Stepper aria-label="Thiết lập" steps={[{ title: 'Kết nối Ữ Ẫ', description: 'Đã đồng bộ ặ ỵ', status: 'complete' }, { title: 'Huấn luyện Ỗ', status: 'current' }]} />
      </Row>
      <Row label="Điều hướng">
        <Tabs defaultValue="a">
          <TabsList aria-label="Tác tử"><TabsTab value="a">Tổng quan Ữ</TabsTab><TabsTab value="b">Nguồn ặ ỵ</TabsTab></TabsList>
          <TabsPanel value="a">Ổn định ặ ọ ỵ</TabsPanel>
          <TabsPanel value="b">Nguồn</TabsPanel>
        </Tabs>
        <Breadcrumbs items={[{ label: 'Không gian Ữ', href: '#' }, { label: 'Báo cáo ặ ỵ' }]} />
      </Row>
      <Row label="Hiển thị">
        <Alert tone="warning" title="Sắp hết hạn mức Ữ Ỗ" description="Yêu cầu sẽ bị giới hạn ặ ọ ỵ." />
        <Card style={{ width: 280 }}>
          <CardHeader><CardTitle>Doanh thu Ữ Ẫ</CardTitle><CardDescription>Tháng trước ặ ỵ</CardDescription></CardHeader>
          <CardContent>{VI}</CardContent>
        </Card>
        <Stat label="Người dùng Ữ" value="Ổn định" hint="so với tháng trước ặ ỵ" style={{ width: 240 }} />
        <EmptyState size="sm" title="Chưa có dữ liệu Ữ" description="Thêm nguồn đầu tiên ặ ọ ỵ." />
        {(['sm', 'md'] as const).map(size => (
          <Prose key={size} size={size} style={{ width: 280 }} dangerouslySetInnerHTML={{ __html: `<h3>Ổn định Ữ Ẫ</h3><p>${VI}, <code>Ỗ ặ</code> và <a href="#vi">liên kết Ữ ỵ</a>.</p><ul><li>Hằng tháng Ữ ỵ</li></ul><blockquote><p>Ẵ ặ ọ ỵ</p></blockquote>` }} />
        ))}
      </Row>
    </div>
  ),
};

/* ---------- Long content in narrow containers ---------- */
const LONG_VI = 'Báo cáo doanh thu hợp nhất quý bốn của toàn bộ chi nhánh khu vực miền Nam';
const TOKEN = 'INV-2026-000184-HCM-PAYMENT-RECONCILIATION';
const EMAIL = 'nguyen.thi.thanh.huong.accounting@cyberskill.world';

/** Long Vietnamese and English text and unbroken tokens (IDs, emails) at 240 and 320px. Nothing may spill or push the box wider. */
export const LongContent: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {[240, 320].map(width => (
        // minmax(0, 1fr): the column stays at the container's width, so a component that can't shrink shows up on its own
        <div key={width} data-bench="container" data-bench-width={width} style={{ width, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12, alignContent: 'start' }}>
          <Button>{LONG_VI}</Button>
          <Badge>{TOKEN}</Badge>
          <Tag>{EMAIL}</Tag>
          <Alert tone="danger" title={LONG_VI} description={`Không gửi được tới ${EMAIL} cho hoá đơn ${TOKEN}.`} />
          <Card><CardHeader><CardTitle>{LONG_VI}</CardTitle><CardDescription>{TOKEN}</CardDescription></CardHeader></Card>
          <Stat label={LONG_VI} value="1.284.000.000 ₫" hint={EMAIL} />
          <TextField label={LONG_VI} defaultValue={EMAIL} error={`${TOKEN} không hợp lệ`} />
          <SelectField label="Tài khoản" items={[{ value: 'a', label: EMAIL }]} defaultValue="a" />
          <Breadcrumbs label={`Breadcrumb ${width}`} items={[{ label: LONG_VI, href: '#' }, { label: TOKEN }]} />
          <Pagination label={`Pagination ${width}`} page={7} pageCount={42} onPageChange={noop} />
          <EmptyState size="sm" title={LONG_VI} description={TOKEN} />
          <Toggle>{LONG_VI}</Toggle>
          <SegmentedControl label={`Chế độ ${width}`} items={[{ value: 'a', label: LONG_VI }, { value: 'b', label: TOKEN }]} defaultValue="a" />
          <Tabs defaultValue="a">
            <TabsList aria-label={`Tabs ${width}`}>{['Tổng quan', 'Doanh thu', 'Chi nhánh', 'Hoá đơn'].map((t, n) => <TabsTab key={t} value={n ? t : 'a'}>{t}</TabsTab>)}</TabsList>
            <TabsPanel value="a">{EMAIL}</TabsPanel>
          </Tabs>
          <Accordion><AccordionItem value="a"><AccordionTrigger>{LONG_VI}</AccordionTrigger><AccordionPanel>{EMAIL}</AccordionPanel></AccordionItem></Accordion>
          <Stepper aria-label={`Steps ${width}`} steps={[{ title: LONG_VI, description: TOKEN, status: 'current' }, { title: EMAIL, status: 'upcoming' }]} />
          <TagInput label={LONG_VI} defaultValue={[EMAIL, TOKEN, LONG_VI]} />
          <Prose dangerouslySetInnerHTML={{ __html: `<h2>${LONG_VI}</h2><p>${EMAIL} <code>${TOKEN}</code> <a href="#t">${TOKEN}</a></p><pre><code>${TOKEN}-${EMAIL}</code></pre><table tabindex="0"><tr><th>${TOKEN}</th><td>${EMAIL}</td></tr></table>` }} />
        </div>
      ))}
    </div>
  ),
};

/* ---------- Invalid states: each form control valid and invalid, side by side ---------- */
const pair = (name: string, valid: ReactNode, invalid: ReactNode) => (
  <div key={name} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16, marginBottom: 16, maxWidth: 720 }}>
    <div data-bench-control={name} data-bench-state="valid">{valid}</div>
    <div data-bench-control={name} data-bench-state="invalid">{invalid}</div>
  </div>
);
const items = [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }];
const PHOTO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='; // 1×1 PNG
const ERR = 'Fix this field.';

/** Every form control, valid next to invalid: the invalid one is announced (aria-invalid), linked to visible error text, and visibly different. */
export const InvalidStates: Story = {
  render: () => (
    <div>
      {pair('TextField', <TextField label="Name" defaultValue="An" />, <TextField label="Name" defaultValue="An" error={ERR} />)}
      {pair('Textarea', <Textarea label="Notes" />, <Textarea label="Notes" error={ERR} />)}
      {pair('Select', <SelectField label="Plan" items={items} />, <SelectField label="Plan" items={items} error={ERR} />)}
      {pair('Combobox', <ComboboxField label="Region" items={items} />, <ComboboxField label="Region" items={items} error={ERR} />)}
      {pair('MultiSelect', <MultiSelectField label="Skills" items={items} />, <MultiSelectField label="Skills" items={items} error={ERR} />)}
      {pair('Autocomplete', <Field label="City"><Autocomplete items={['Hà Nội', 'Huế']} /></Field>, <Field label="City" error={ERR}><Autocomplete items={['Hà Nội', 'Huế']} /></Field>)}
      {pair('SearchField', <SearchField label="Search" />, <SearchField label="Search" error={ERR} />)}
      {pair('PasswordField', <PasswordField label="Password" defaultValue="secret" />, <PasswordField label="Password" defaultValue="secret" error={ERR} />)}
      {pair('TagInput', <TagInput label="Keywords" defaultValue={['a']} />, <TagInput label="Keywords" defaultValue={['a']} error={ERR} />)}
      {pair('AvatarUpload', <AvatarUpload label="Photo" fallback="AN" />, <AvatarUpload label="Photo" fallback="AN" error={ERR} />)}
      {pair('NumberField', <NumberField label="Seats" defaultValue={5} />, <NumberField label="Seats" defaultValue={5} error={ERR} />)}
      {pair('OtpField', <OtpField label="Code" length={4} />, <OtpField label="Code" length={4} error={ERR} />)}
      {pair('DatePicker', <DatePicker label="Start date" />, <DatePicker label="Start date" error={ERR} />)}
      {pair('TimePicker', <TimePicker label="Start time" />, <TimePicker label="Start time" error={ERR} />)}
      {pair('DateRangePicker', <DateRangePicker label="Period" />, <DateRangePicker label="Period" error={ERR} />)}
      {pair('Checkbox', <Checkbox label="I accept the terms" />, <Checkbox label="I accept the terms" error={ERR} />)}
      {pair('RadioGroup',
        <RadioGroup label="Billing"><Radio value="m" label="Monthly" /><Radio value="y" label="Yearly" /></RadioGroup>,
        <RadioGroup label="Billing" error={ERR}><Radio value="m" label="Monthly" /><Radio value="y" label="Yearly" /></RadioGroup>)}
      {pair('FileUpload', <FileUpload label="Attachments" />, <FileUpload label="Attachments" error={ERR} />)}
      {pair('DateTimePicker', <DateTimePicker label="Starts" />, <DateTimePicker label="Starts" error={ERR} />)}
      {pair('CheckboxGroup',
        <CheckboxGroup label="Channels"><Checkbox value="e" label="Email" /><Checkbox value="s" label="SMS" /></CheckboxGroup>,
        <CheckboxGroup label="Channels" error={ERR}><Checkbox value="e" label="Email" /><Checkbox value="s" label="SMS" /></CheckboxGroup>)}
    </div>
  ),
};

/* ---------- Disabled states: each control enabled and disabled, side by side ---------- */
const twin = (name: string, enabled: ReactNode, disabled: ReactNode) => (
  <div key={name} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16, marginBottom: 16, maxWidth: 720 }}>
    <div data-bench-twin={name} data-bench-state="enabled">{enabled}</div>
    <div data-bench-twin={name} data-bench-state="disabled">{disabled}</div>
  </div>
);

/** Every control enabled next to disabled: a disabled control (and each button inside it) must look different, not only change the cursor. */
export const DisabledStates: Story = {
  render: () => (
    <div>
      {twin('Button', <Button>Save</Button>, <Button disabled>Save</Button>)}
      {twin('Toggle', <Toggle>Pin</Toggle>, <Toggle disabled>Pin</Toggle>)}
      {twin('TextField', <TextField label="Name" defaultValue="An" />, <TextField label="Name" defaultValue="An" disabled />)}
      {twin('Textarea', <Textarea label="Notes" defaultValue="Hi" />, <Textarea label="Notes" defaultValue="Hi" disabled />)}
      {twin('Select', <SelectField label="Plan" items={items} defaultValue="a" />, <SelectField label="Plan" items={items} defaultValue="a" disabled />)}
      {twin('Combobox', <ComboboxField label="Region" items={items} defaultValue="a" />, <ComboboxField label="Region" items={items} defaultValue="a" disabled />)}
      {twin('MultiSelect', <MultiSelectField label="Skills" items={items} defaultValue={['a']} />, <MultiSelectField label="Skills" items={items} defaultValue={['a']} disabled />)}
      {twin('SearchField', <SearchField label="Search" defaultValue="tokens" />, <SearchField label="Search" defaultValue="tokens" disabled />)}
      {twin('PasswordField', <PasswordField label="Password" defaultValue="secret" />, <PasswordField label="Password" defaultValue="secret" disabled />)}
      {twin('TagInput', <TagInput label="Keywords" defaultValue={['a']} />, <TagInput label="Keywords" defaultValue={['a']} disabled />)}
      {twin('AvatarUpload', <AvatarUpload label="Photo" defaultValue={PHOTO} />, <AvatarUpload label="Photo" defaultValue={PHOTO} disabled />)}
      {twin('NumberField', <NumberField label="Seats" defaultValue={5} min={1} />, <NumberField label="Seats" defaultValue={5} min={1} disabled />)}
      {/* at its minimum, only the decrement button is disabled */}
      {twin('NumberField at min', <NumberField label="Seats" defaultValue={5} min={1} />, <NumberField label="Seats" defaultValue={1} min={1} />)}
      {twin('DatePicker', <DatePicker label="Start date" />, <DatePicker label="Start date" disabled />)}
      {twin('TimePicker', <TimePicker label="Start time" />, <TimePicker label="Start time" disabled />)}
      {twin('Checkbox', <Checkbox label="I accept" />, <Checkbox label="I accept" disabled />)}
      {twin('Switch', <Switch label="Auto-deploy" />, <Switch label="Auto-deploy" disabled />)}
      {twin('RadioGroup',
        <RadioGroup label="Billing"><Radio value="m" label="Monthly" /><Radio value="y" label="Yearly" /></RadioGroup>,
        <RadioGroup label="Billing" disabled><Radio value="m" label="Monthly" /><Radio value="y" label="Yearly" /></RadioGroup>)}
      {twin('SegmentedControl',
        <SegmentedControl label="View" items={[{ value: 'a', label: 'List' }, { value: 'b', label: 'Board' }]} defaultValue="a" />,
        <SegmentedControl label="View" items={[{ value: 'a', label: 'List' }, { value: 'b', label: 'Board' }]} defaultValue="a" disabled />)}
      {twin('Slider', <Slider label="Volume" defaultValue={40} />, <Slider label="Volume" defaultValue={40} disabled />)}
    </div>
  ),
};

/** A select with long options, opened: the popup stays inside a phone screen (measured by the 320px reflow check). */
export const OpenSelectLongOptions: Story = {
  render: () => <div style={{ maxWidth: 280 }}><SelectField label="Tài khoản" items={[{ value: 'a', label: EMAIL }, { value: 'b', label: `${LONG_VI} ${TOKEN}` }]} /></div>,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox', { name: 'Tài khoản' }));
    await waitFor(() => expect(document.querySelector('[role="listbox"]')).toBeTruthy());
  },
};

/* ---------- Nested themes: a dark scope in a light page (and the reverse), with a popup opened inside ---------- */
const Scoped = ({ theme }: { theme: 'light' | 'dark' }) => (
  <ThemeScope theme={theme} data-bench-scope={theme} style={{ padding: 24, background: 'var(--background)', color: 'var(--foreground)', borderRadius: 12 }}>
    <p style={{ marginTop: 0 }}>{theme === 'dark' ? 'Dark' : 'Light'} section</p>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button>Primary</Button>
      <Badge tone="success">Healthy</Badge>
      <TextField label="Workspace" defaultValue="Acme" />
      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>{`Open ${theme} popover`}</PopoverTrigger>
        <PopoverContent title="Monthly limit" description="Agents pause at this many messages." />
      </Popover>
    </div>
  </ThemeScope>
);

/** ThemeScope inside a page of the other theme: the section and every popup opened from it take the section's theme. */
export const NestedThemes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Scoped theme="dark" />
      <Scoped theme="light" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open dark popover' }));
    await waitFor(() => expect(document.querySelector('[data-theme="dark"] .cs-popover, .cs-portal-host[data-theme="dark"] [role="dialog"]')).toBeTruthy());
  },
};

/* ---------- Status tones ---------- */
const TONES = ['info', 'success', 'warning', 'danger'] as const;

/** Every status tone in Badge (each variant) and Alert: tones stay tellable apart, also for color-blind readers, and never by color alone. */
export const StatusTones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
      {(['soft', 'solid', 'outline'] as const).map(variant => (
        <Row key={variant} label={`Badge ${variant}`}>
          {TONES.map(tone => <span key={tone} data-bench-tone={tone} data-bench-group={`badge-${variant}`}><Badge tone={tone} variant={variant}>{tone}</Badge></span>)}
        </Row>
      ))}
      {TONES.map(tone => (
        <div key={tone} data-bench-tone={tone} data-bench-group="alert">
          <Alert tone={tone} title={`${tone.charAt(0).toUpperCase()}${tone.slice(1)} message`} description="Something happened." action={<Button size="sm" variant="secondary" iconStart={<Trash />}>Undo</Button>} />
        </div>
      ))}
    </div>
  ),
};
