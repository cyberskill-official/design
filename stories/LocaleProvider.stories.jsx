import React from 'react';
import {LocaleProvider,useMessages} from '../components/i18n/LocaleProvider.jsx';
import {Pagination} from '../components/navigation/Pagination.jsx';
function Copy({lang='en'}) {const t=useMessages('Checkout',lang);return <p>{t('pay')}</p>}
export default {
  title: 'Components/Localization/LocaleProvider',
  component: LocaleProvider,
  tags: ['autodocs'],
  args: {
    messages: {Pagination:{en:{next:'Continue'}},Checkout:{en:{pay:'Pay now'},vi:{pay:'Thanh toán'}}},
  },
  argTypes: {
    messages: {control: 'object'},
    children: {control: false},
  },
};

export const Default={render:function D(args){return <LocaleProvider {...args}><Copy/><Pagination lang="en" pageCount={10}/></LocaleProvider>}};
export const Matrix={name:'Matrix / Nested scopes and bilingual copy',render:function M(){return <LocaleProvider messages={{Checkout:{en:{pay:'Outer payment'},vi:{pay:'Thanh toán ngoài'}}}}><Copy lang="en"/><Copy lang="vi"/><LocaleProvider messages={{Checkout:{en:{pay:'Inner payment'}}}}><Copy lang="en"/><Copy lang="vi"/></LocaleProvider></LocaleProvider>}};
class MessageBoundary extends React.Component {constructor(props){super(props);this.state={error:false}}static getDerivedStateFromError(){return {error:true}}render(){return this.state.error?<p role="alert">Dictionary rejected: message values must be strings.</p>:this.props.children}}
export const InvalidDictionary={render:()=> <MessageBoundary><LocaleProvider messages={{Checkout:{en:{pay:42}}}}><Copy/></LocaleProvider></MessageBoundary>};
