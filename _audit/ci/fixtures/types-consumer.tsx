import { createElement, type ReactNode } from 'react';
import { Card, CardHeader, Collapsible, ListItem, Alert, Toast, ToastStack, Select, Slider, NumberField, PromptInput, OverlayProvider, EDITOR_SCHEMA, FormField, Toggle, Form, FormWizard, Tabs, SegmentedControl } from '@cyberskill/design';

const title: ReactNode = createElement('strong', null, 'Title');
const tree = <OverlayProvider><Card as="section"><CardHeader title={title}/><Collapsible title={title}/><ListItem title={title}/><Alert title={title}/><Toast title={title}/><Slider lang="vi" min={0} max={10}/><NumberField onChange={n => n.toFixed(2)}/><PromptInput onChange={s => s.toUpperCase()}/></Card></OverlayProvider>;
void tree;
const tag: string = EDITOR_SCHEMA.tags[0];
void tag;
// @ts-expect-error Numeric callbacks must not receive strings.
const wrongNumber = <NumberField onChange={(n: string) => n.toUpperCase()}/>;
// @ts-expect-error Native range min is a number or string, never an object.
const wrongSlider = <Slider min={{invalid: true}}/>;
void wrongNumber; void wrongSlider;

const pressedField = <FormField label="Formatting" name="bold" valueProp="pressed"><Toggle>Bold</Toggle></FormField>;
// @ts-expect-error Binding must use a supported value property.
const invalidBinding = <FormField label="Invalid" valueProp="selected"><Toggle>Invalid</Toggle></FormField>;
void pressedField; void invalidBinding;

const submissions: Record<string, unknown>[] = [];
const syncSubmit = <Form onSubmit={values => submissions.push(values)}/>;
const syncComplete = <FormWizard steps={[]} onComplete={values => submissions.push(values)}/>;
const asyncSubmit = <Form onSubmit={async values => { submissions.push(values); }}/>;
const asyncComplete = <FormWizard steps={[]} onComplete={async values => { submissions.push(values); }}/>;
void syncSubmit; void syncComplete; void asyncSubmit; void asyncComplete;

const linkedTabs = <Tabs tabs={[{value:"a",label:"Alpha",id:"a-tab","aria-controls":"a-panel"}]} />;
const linkedSegments = <SegmentedControl options={[{value:"b",label:"Beta",id:"b-tab","aria-controls":"b-panel"}]} />;
// @ts-expect-error Panel references are string IDs, not numbers.
const invalidPanel = <Tabs tabs={[{value:"a",label:"Alpha","aria-controls":1}]} />;
void linkedTabs; void linkedSegments; void invalidPanel;

const dismissibleAlert = <Alert onDismiss={event => { const button: HTMLButtonElement = event.currentTarget; void button; }}>Notice</Alert>;
const localizedStack = <ToastStack lang="vi"><Toast>Saved</Toast></ToastStack>;
void dismissibleAlert; void localizedStack;

const selectPlaceholder = <Select placeholder="Choose a project" options={[{value:"a",label:"Alpha"}]}/>;
void selectPlaceholder;
