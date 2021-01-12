### Thank you for using Custom Browser Confirmation Prompt!
This package allows the developer to easily replace the browser's default confirmation prompt with their own custom component. This is specifically written with the browser back button in mind, because typically if a user leaves a page via the browser's back button, the only option available to warn them is the browser's built-in confirmation prompt. By replacing the browser's built-in prompt with our own component, we maintain the intended functionality of the browser without sacrificing our application's UI/UX.

*Some considerations:*

1. This only works for router events, such as clicking on something (a link, browser back/forward button) to fire a navigation event. This *will not* work for browser navigation events, such as inputting a new URL and hitting enter or closing the window/tab.
2. This currently only works for projects that use [react-router-dom](https://reactrouter.com/web/guides/quick-start)'s `<BrowserRouter>`, `<HashRouter>`, or `<MemoryRouter>`  for routing. If you aren't using `<BrowserRouter>`, consider implementing it, because it's awesome.
3. I will look into updating this in the future, but feel free to suggest changes on the [github repo](https://github.com/drmeloy/custom-browser-confirmation-prompt).

To install, run 

`npm i custom-browser-confirmation-prompt`

or 

`yarn add custom-browser-confirmation-prompt`

### How to use Custom Browser Confirmation Prompt:
There are three files that must be managed to use this properly:
  
__*1. Your custom prompt*__

This is the React component that you will be putting in place of the default browser confirmation prompt. Keep in mind that this component will be placed outside of your application, as it will be used by the browser and *not* by your application. As a result, any wrappers that your component requires to render (for example a `<ThemeProvider>`) must be included in this component.

__*2. Your router component*__

This is wherever in your application you're using `<BrowserRouter>` to establish the routing of your application. `<BrowserRouter>` accepts the prop `getUserConfirmation` which is the confirmation prompt, defaulted to the built-in prompt of the browser. This is where we will be providing our custom component to replace the browser's.

__*3. The page to be watched*__

This is the page of your application where you want to provide warning to the user if they nagivate away from. Usually this is a form, but it can be anything. To provide warning to the user, you will be incorporating the [Prompt](https://reactrouter.com/core/api/Prompt) component from [react-router-dom](https://reactrouter.com/web/guides/quick-start). `<Prompt>` accepts a condition (for example, the form being dirty) and a message. When the provided condition evaluates to `true`, router navigation events are blocked and the browser's confirmation prompt (soon to be your custom component) gets sent to the user with the provided message, asking the user to please confirm their navigation.

#### Step-by-step walkthrough:
__Step 1: Create your custom prompt component__

You custom component can be whatever you want, but is usually some sort of dialog or modal that accepts a confirm or a cancel. *It must accept and use the following props*:

  1. `message`: The message that will be displayed to the user in the prompt. Must be a string.
  2. `closePrompt`: The function that gets invoked when a user confirms or cancels from within the prompt. On confirm, invoke `closePrompt(true)`, which will allow the user to continue their navigation. For cancel, invoke `closePrompt(false)`, which will prevent navigation and close the prompt.

Example custom prompt component:
  
```javascript
import React from 'react';
import { ThemeProvider } from 'my-preferred-theme-provider';
import { theme } from 'my-preferred-theme';
import { Dialog } from 'my-preferred-library/dialog';

export default function CustomPrompt({ message, closePrompt}) {
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        isOpen={true}
        confirmButtonText='Confirm'
        onConfirmClick={closePrompt(true)}
        cancelButtonText='Cancel'
        onCancelClick={closePrompt(false)}
      >
        {message}
      </Dialog>
    </ThemeProvider>
  );
}
```

__Step 2: Insert your custom component into the application router__

Wherever you utilize `react-router-dom`'s router (typically `<BrowserRouter>`), import your `CustomPrompt` and `CustomConfirmationPrompt` from `custom-browser-confirmation-prompt`. `<BrowserRouter>` takes  a `getUserConfirmation` prop, which accepts a function that takes a `message` and a `callback`. In the return of the function, pass in `CustomConfirmationPrompt` with `message`, `callback`, and `CustomPrompt` as the first, second, and third arguments, respectively.

Example application router:

```javascript
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'my-preferred-theme-provider';
import { theme } from 'my-preferred-theme';
import { CustomConfirmationPrompt } from 'custom-browser-confirmation-prompt';
import { Home } from './Home';
import { Form } from './Form';
import { CustomPrompt } from './CustomPrompt';

export default function App() {
  return (
    <BrowserRouter
      getUserConfirmation={(message, callback) => 
        CustomConfirmationPrompt(message, callback, CustomPrompt)
      }
    >
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path='/home' component={Home} />
          <Route path='/form' component={Form} />
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  )
}
```

__Step 3: Insert `<Prompt>` into your form page (or wherever you want navigation confirmation)__

Import `Prompt` from `react-router-dom` and insert it anywhere in the return of your form page. Pass in the `when` and `message` props. Keep in mind that `when` *must* evaluate to either true or false, and if a navigation event occurs while `when={true}`, your custom dialog will appear to ask the user for their confirmation.

Example form component:

```javascript
import React, { useState } from 'react';
import { Prompt } from 'react-router-dom';
import saveResults from './utils';

export default function Form() {
  const [name, setName] = useState('');
  const [favFood, setFavFood] = useState('');

  const formIsDirty = (name, favFood) => !(name === '' && favFood === '');

  return (
    <>
      <Prompt
        when={formIsDirty}
        message='Are you sure you want to leave? Changes will not be saved.'
      />
      <h1>Please enter the following information:</h1>
      <h3>Enter your name:</h3>
      <input 
        onChange={({ target }) => setName(target.value)}
        value={name}
      />
      <h3>Enter your favorite food:</h3>
      <input 
        onChange={({ target }) => setFavFood(target.value)}
        value={favFood}
      />
      <button onClick={() => saveResults(name, favFood)}>
        Save
      </button>
    </>
  )
}
```

### Voilà! That's everything!

You should now have everything you need to insert custom components into the browser to use as confirmation dialogs! I hope it helps!