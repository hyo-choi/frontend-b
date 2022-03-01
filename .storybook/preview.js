//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
import ContextProvider from '~hooks/useContext';

export const decorators = [
  (Story) => (
    <ContextProvider>
      <Story />
    </ContextProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
