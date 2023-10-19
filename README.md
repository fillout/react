# Fillout React Embeds
Embed [Fillout](https://fillout.com) forms directly in your React project. TypeScript included, no dependencies :)

## Setup
Install with `npm i @fillout/react`, and load the stylesheet with `import "@fillout/react/style.css"`

## Embed components
There is a component for each embed type. All of them require the `filloutId` prop, which is the id of your form. This code is easy to spot in the url of the editor or the live form, for example, `form.fillout.com/t/foAdHjd1Duus`.

All embed components allow you to pass parameters using the optional `parameters` prop, and you can also use `inheritParameters` to make the form inherit the query parameters from the host page's url.

## Standard embed
This one is pretty simple.

```js
import { FilloutStandardEmbed } from "@fillout/react";

function App() {
  return (
    <div style={{
      width: 400,
      height: 400
    }}>
      <FilloutStandardEmbed filloutId="foAdHjd1Duus" />
    </div>
  );
}

export default App;
```

If you'd rather not set the embed height manually and instead have it expand to the form size, use the `dynamicResize` prop.

## FullScreen embed
The `FilloutFullScreenEmbed` component fills the entire page, with `position: fixed`.

```js
import { FilloutFullScreenEmbed } from "@fillout/react";

function App() {
  return (
    <FilloutFullScreenEmbed filloutId="foAdHjd1Duus" inheritParameters />
  );
}

export default App;
```


## Popup embed
This component creates a popup, with a dark background covering the page content behind. Unlike the FullScreen embed, it can be closed using the close button or by clicking outside of the popup.

![popup screenshot](https://github.com/fillout/react/assets/97917457/4128bb96-0185-44e0-9172-ada02f7630e2)

You control it using your own state. An `onClose` prop is required, and should be used to unrender the popup.

```js
import { FilloutPopupEmbed } from "@fillout/react";
import { useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Schedule a call</button>

      {isOpen && (
        <FilloutPopupEmbed
          filloutId="foAdHjd1Duus"
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default App;
```

## Slider embed
Similar to the popup embed, this is intended to be rendered conditionally, and requires a function to be passed to the `onClose` prop. The form will slide out from the side of the screen. You can control which direction it comes from using `sliderDirection`, which can be `left` or `right` (default).

![slider screenshot](https://github.com/fillout/react/assets/97917457/96ba6d31-49d9-4781-831e-fec4e062db3d)

```js
import { FilloutSliderEmbed } from "@fillout/react";
import { useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Schedule a call</button>

      {isOpen && (
        <FilloutSliderEmbed
          filloutId="foAdHjd1Duus"
          inheritParameters
          parameters={{
            example: "abc"
          }}
          onClose={() => setIsOpen(false)}
          sliderDirection="left"
        />
      )}
    </>
  );
}

export default App;
```

## Popup and Slider embed buttons
If you would prefer not to manage the open state of a popup or slider yourself, you can use `FilloutPopupEmbedButton` or `FilloutSliderEmbedButton`. This will render a button that opens the embed when clicked. These components take the same props as their standalone counterparts (except for `onClose`), but have some extra optional props to customize the button.
- `text` - change the button text
- `color` - change the button background color. the text color will automatically contrast with this as long as you specify a hex code.
- `size` - small, medium or large
- `float` - make your button float on the screen. `bottomLeft` or `bottomRight`.

```js
import { FilloutSliderEmbedButton } from "@fillout/react";

function App() {
  return (
    <FilloutSliderEmbedButton
      filloutId="foAdHjd1Duus"
      inheritParameters
      parameters={{
        example: "abc",
      }}
      sliderDirection="left"
      text="Schedule a call"
      color="#444444"
      size="small"
      float="bottomRight"
    />
  );
}

export default App;
```

If you need greater control over the button appearance, you can just make your own and conditionally render the standalone embed components.
