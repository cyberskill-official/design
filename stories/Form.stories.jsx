import { Form, FormField, FormFieldArray, FormWizard } from '../components/forms/Form.jsx';
import { TextField } from '../components/textfield/TextField.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Forms/Form',
  component: Form,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "onSubmit": {
    "control": false
  },
  "errors": {
    "control": "text"
  },
  "rules": {
    "control": "object"
  },
  "asyncRules": {
    "control": "text"
  },
  "initialValues": {
    "control": "text"
  },
  "lang": {
    "control": "text"
  }
},
};

export const Default = { render: (args) => (<Form onSubmit={() => {}} {...args}><FormField name="email" label="Email"><TextField label="Email" name="email" /></FormField><Button type="submit">Submit</Button></Form>) };

export const Matrix = {
  name: 'Matrix / Fields',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Form onSubmit={() => {}}>
        <FormField name="a" label="A"><TextField label="A" name="a" /></FormField>
        <Button type="submit">One field</Button>
      </Form>
      <Form onSubmit={() => {}}>
        <FormField name="a" label="A"><TextField label="A" name="a" /></FormField>
        <FormField name="b" label="B"><TextField label="B" name="b" /></FormField>
        <Button type="submit">Two fields</Button>
      </Form>
    </div>
  ),
};

// Companion exports need mounted examples, not merely imports.
export const Wizard = {
  render: () => <FormWizard steps={[
    { title: 'Profile', render: () => <FormField name="name" label="Name"><input /></FormField> },
    { title: 'Review', render: ({ values }) => <p>{String(values.name || 'New profile')}</p> },
  ]} onComplete={() => {}} />,
};
export const FieldArray = {
  render: () => <Form initialValues={{ teammates: [{ name: 'Lumi' }] }}>
    <FormFieldArray name="teammates" label="Teammates" defaultItem={{ name: '' }}>
      {({ index, path, remove }) => <div><FormField name={path('name')} label={`Teammate ${index + 1}`}><input /></FormField><button type="button" onClick={remove}>Remove</button></div>}
    </FormFieldArray>
  </Form>,
};

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioFormError = {
  name: "Form: Validation error",
  args: {
  "children": {
    "$element": {
      "component": "TextField",
      "props": {
        "label": "Name",
        "name": "name",
        "defaultValue": "Alpha"
      },
      "children": null
    }
  },
  "errors": {
    "name": "Form scenario validation error"
  }
},
  render: args => renderComponentScenario("Form--error",args),
  play: ({canvasElement}) => playComponentScenario("Form--error",canvasElement),
};

export const ScenarioFormFieldError = {
  name: "FormField: Validation error",
  args: {
  "label": "Name",
  "hint": "Reference hint",
  "children": {
    "$element": {
      "component": "TextField",
      "props": {
        "label": "Reference input"
      },
      "children": null
    }
  },
  "error": "FormField scenario validation error"
},
  render: args => renderComponentScenario("FormField--error",args),
  play: ({canvasElement}) => playComponentScenario("FormField--error",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
