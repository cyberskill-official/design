import React from 'react';
import {FormField} from '../../../components/forms/Form.jsx';
import {TextField} from '../../../components/textfield/TextField.jsx';

export function TextFieldAssociationFixture() {
  const [invalid, setInvalid] = React.useState(true);
  const primary = React.useRef(null);
  React.useEffect(() => {
    window.updateTextFieldContext = setInvalid;
    window.textFieldObjectRef = primary;
  }, []);
  const capture = React.useCallback(node => {
    if (typeof window !== 'undefined') window.textFieldCallbackRef = node;
  }, []);
  return <React.StrictMode>
    <span id="outside-name">External name</span>
    <span id="outside-help">External help</span>
    <FormField lang="en" label="Parent name" hint="Parent help" error={invalid ? 'Parent error' : undefined} required={invalid}>
      <div>
        <TextField data-testid="inherited" ref={primary} description="Local help" aria-describedby="outside-help outside-help" defaultValue="seed" onInput={() => { window.textFieldInputEvents = (window.textFieldInputEvents || 0) + 1; }}/>
        <TextField data-testid="local" id="explicit-local" ref={capture} label="Local name" description={0} error={0}/>
        <TextField data-testid="explicit" label="Visible local name" aria-label="Explicit name"/>
        <TextField data-testid="external" label="Visible other name" aria-labelledby="outside-name"/>
      </div>
    </FormField>
  </React.StrictMode>;
}
