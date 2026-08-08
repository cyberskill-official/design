import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'CyberSkill Design System',
    brandUrl: 'https://design.cyberskill.world/',
    brandImage: './assets/logo-mark.svg',
    brandTarget: '_self',
    colorPrimary: '#F4BA17',
    colorSecondary: '#45210E',
    appBg: '#FFFDF8',
    appContentBg: '#FFFFFF',
    appPreviewBg: '#FFFDF8',
    appBorderColor: '#E7D9C6',
    appBorderRadius: 8,
    textColor: '#45210E',
    textMutedColor: '#6E5A4C',
    barTextColor: '#6E5A4C',
    barSelectedColor: '#45210E',
    barHoverColor: '#F4BA17',
    barBg: '#FFFDF8',
    inputBg: '#FFFFFF',
    inputBorder: '#E7D9C6',
    inputTextColor: '#45210E',
    inputBorderRadius: 8,
  }),
});
