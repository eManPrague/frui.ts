import '@storybook/addon-actions/register';
import '@storybook/addon-storysource/register';
import { withInfo } from '@storybook/addon-info';
import { addDecorator } from '@storybook/react';

addDecorator(withInfo());
