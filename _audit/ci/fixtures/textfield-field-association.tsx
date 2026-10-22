import * as React from 'react';
import {TextField} from '../../../components/textfield/TextField';
import {FormField} from '../../../components/forms/Form';

const inputRef = React.createRef<HTMLInputElement>();
export const inherited = <FormField label="Parent name" required error="Required value"><div>
  <TextField ref={inputRef} name="first" description="First help"/>
  <TextField name="second"/>
</div></FormField>;
export const explicitName = <TextField aria-label="Name" required type="text" onInput={event => event.currentTarget.select()}/>;
export const referencedName = <><span id="name">Name</span><TextField aria-labelledby="name"/></>;
export const localName = <TextField label={0} description={0} error={0} ref={node => {if(node) node.select();}}/>;
// @ts-expect-error A TextField ref still targets its native input.
export const wrongRef = <TextField aria-label="Name" ref={React.createRef<HTMLDivElement>()}/>;
// @ts-expect-error Native required is a boolean; field association does not loosen native contracts.
export const wrongRequired = <TextField aria-label="Name" required="yes"/>;
