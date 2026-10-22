import * as React from 'react';
import {Logo} from '../../../components/logo/Logo';

const svg=React.createRef<SVGSVGElement>();
export const inheritedTitleChild=<Logo title="Official" size={48} ref={svg}><title>Ignored caller title</title></Logo>;
export const inheritedFragment=<Logo decorative ref={node=>{if(node)node.getBBox();}}><><title>Ignored</title><path d="M0 0L1 1"/></></Logo>;
export const inheritedNativeProps=<Logo className="native" data-owner="consumer" onClick={event=>event.currentTarget.getBBox()}/>;
// @ts-expect-error The primary native ref remains the SVG element.
export const wrongRef=<Logo ref={React.createRef<HTMLDivElement>()}/>;
// @ts-expect-error The controlled size remains numeric.
export const wrongSize=<Logo size="large"/>;
