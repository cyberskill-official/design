import React from 'react';
import { Cascader } from '../../../components/forms/Cascader';
import { TreeSelect } from '../../../components/forms/TreeSelect';
import { ColorPicker } from '../../../components/forms/ColorPicker';
import { TagInput } from '../../../components/forms/TagInput';
import { Rating } from '../../../components/forms/Rating';
import { InputOTP } from '../../../components/forms/InputOTP';
const roots={className:'consumer', 'data-observation':'field'};
<Cascader nodes={[]} rootProps={roots} controlProps={{id:'region',onClick:event=>event.currentTarget.focus(),'aria-describedby':'region-help'}} description="Help" error={<span>Error</span>} required />;
<TreeSelect nodes={[]} rootProps={roots} controlProps={{'aria-labelledby':'tree-label'}} />;
<ColorPicker rootProps={{onClick:event=>{ const span: HTMLSpanElement=event.currentTarget; void span; }}} controlProps={{'data-action':'color'}} />;
<TagInput rootProps={roots} controlProps={{id:'tags',onBlur:event=>event.currentTarget.focus()}} required />;
<Rating rootProps={roots} controlProps={{id:'rating','aria-required':true}} />;
<InputOTP rootProps={roots} controlProps={{id:'code','aria-labelledby':'code-label'}} required />;
// @ts-expect-error primary trigger type remains button
<Cascader nodes={[]} controlProps={{type:'submit'}} />;
// @ts-expect-error logical tags do not serialize the draft by native name
<TagInput controlProps={{name:'tags'}} />;
// @ts-expect-error draft emptiness does not validate the logical tags array
<TagInput controlProps={{required:true}} />;
// @ts-expect-error group requirement is described; aria-required is unsupported
<InputOTP controlProps={{'aria-required':true}} />;
// @ts-expect-error OTP role remains group
<InputOTP controlProps={{role:'textbox'}} />;
// @ts-expect-error popup button does not support aria-required
<ColorPicker controlProps={{'aria-required':true}} />;
// @ts-expect-error value ownership stays on component
<Rating controlProps={{value:3}} />;

// @ts-expect-error both OTP bags target the group, which has no aria-required
<InputOTP rootProps={{'aria-required':true}} />;
