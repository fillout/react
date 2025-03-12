# Fillout React Embeds

Embed [Fillout](https://fillout.com) forms directly in your React project. TypeScript included, no dependencies :)

*Hint: If you're looking to use the Fillout API in Node.js, try [@fillout/api](https://npmjs.org/package/@fillout/api)!*

- [Setup](#setup)
- [Embed components](#embed-components)
  - [Standard embed](#standard-embed)
  - [FullScreen embed](#fullscreen-embed)
  - [Popup embed](#popup-embed)
  - [Slider embed](#slider-embed)
  - [Popup and Slider embed buttons](#popup-and-slider-embed-buttons)
- [Listening for form events](#listening-for-form-events)
- [Custom domains](#custom-domains)

## Setup

Install with `npm i @fillout/react`, and load the stylesheet with `import "@fillout/react/style.css"`

## Embed components

There is a component for each embed type. All of them require the `filloutId` prop, which is the id of your form. This code is easy to spot in the url of the editor or the live form, for example, `forms.fillout.com/t/foAdHjd1Duus`.

All embed components allow you to pass URL parameters using the optional `parameters` prop, and you can also use `inheritParameters` to make the form inherit the parameters from the host page's url.

### Standard embed

This one is pretty simple.

```js
import { FilloutStandardEmbed } from "@fillout/react";
import "@fillout/react/style.css";

function App() {
  return (
    <div
      style={{
        width: 400,
        height: 400,
      }}
    >
      <FilloutStandardEmbed filloutId="foAdHjd1Duus" />
    </div>
  );
}

export default App;
```

If you'd rather not set the embed height manually and instead have it expand to the form size, use the `dynamicResize` prop.

### FullScreen embed

The `FilloutFullScreenEmbed` component fills the entire page, with `position: fixed`.

```js
import { FilloutFullScreenEmbed } from "@fillout/react";
import "@fillout/react/style.css";

function App() {
  return <FilloutFullScreenEmbed filloutId="foAdHjd1Duus" inheritParameters />;
}

export default App;
```

### Popup embed

This component creates a popup, with a dark background covering the page content behind. Unlike the FullScreen embed, it can be closed using the close button or by clicking outside of the popup.

![popup screenshot](https://prod-fillout-oregon-s3.s3.us-west-2.amazonaws.com/orgid-9948/flowpublicid-foAdHjd1Duus/0d232c8c-d352-44de-91ab-ee829ab70418-fko1grlyaYLFEpwi1s8ixBBZeQ3ou2d4vLiQVfriYxIctfeRRYTqzyQzuZZ57YEOp4oxRoIoF4dK33X6bV7Re6mLKDLCSVvFz3z/popup.png)

You control it using your own state. An `onClose` prop is required, and should be used to unrender the popup.

```js
import { FilloutPopupEmbed } from "@fillout/react";
import { useState } from "react";
import "@fillout/react/style.css";

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

### Slider embed

Similar to the popup embed, this is intended to be rendered conditionally, and requires a function to be passed to the `onClose` prop. The form will slide out from the side of the screen. You can control which direction it comes from using `sliderDirection`, which can be `left` or `right` (default).

![slider screenshot](https://prod-fillout-oregon-s3.s3.us-west-2.amazonaws.com/orgid-9948/flowpublicid-foAdHjd1Duus/d3cf14e2-a6a1-4ca1-8670-7763e7a20ae0-SkWcSu1ZFm0ecjxVQxdb3kEgtDW5s5SE9LreXH2DT7AAqhO3QkLO5b0Ls61ouUPz7l1iog9KR4Diuwfrwv21YHDks84IxWuRDPN/slider.png)

```js
import { FilloutSliderEmbed } from "@fillout/react";
import { useState } from "react";
import "@fillout/react/style.css";

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
            example: "abc",
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

### Popup and Slider embed buttons

If you would prefer not to manage the open state of a popup or slider yourself, you can use `FilloutPopupEmbedButton` or `FilloutSliderEmbedButton`. This will render a button that opens the embed when clicked. These components take the same props as their standalone counterparts (except for `onClose`), but have some extra optional props to customize the button.

- `text` - change the button text
- `color` - change the button background color. the text color will automatically contrast with this as long as you specify a hex code.
- `size` - small, medium or large
- `float` - make your button float on the screen. `bottomLeft` or `bottomRight`.

```js
import { FilloutSliderEmbedButton } from "@fillout/react";
import "@fillout/react/style.css";

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

## Listening for form events
You can listen for certain form events using the `onInit`, `onPageChange` and `onSubmit` props. Each of these give the submission UUID as the first parameter, and the `onPageChange` prop gives the page ID as the second parameter.

```js
import { FilloutStandardEmbed } from "@fillout/react";
import "@fillout/react/style.css";

function App() {
  return (
    <FilloutStandardEmbed
      filloutId="4SVaJQNVdrus"
      dynamicResize

      onInit={(submissionUuid) => {
        console.log(
          `User started filling out the form (submission ID: ${submissionUuid})`
        );
      }}

      onPageChange={(submissionUuid, pageId) => {
        if (pageId === "qTcp") {
          console.log("User is on the review step");
        }
      }}

      onSubmit={async (submissionUuid) => {
        const email = await doSomethingOnYourServer(submissionUuid);
        console.log(`${email} finished filling out the form`);
      }}
    />
  );
}

export default App;
```

This can be used in conjunction with the [@fillout/api](https://npmjs.org/package/@fillout/api) package on your server to get information about the structure of your form and to fetch field values once you have the submission UUID.

> ⚠️ The `onPageChange` may be triggered for any page on your form, including the starting page when the embed first loads. You should always check the page ID instead of making assumptions about where the user is in the form just because the function was triggered.

## Custom domains

If you want to take advantage of features that are only available with forms hosted on your own domain, such as custom JS, you can use the `domain` prop to change the embedded url.

```js
import { FilloutFullScreenEmbed } from "@fillout/react";
import "@fillout/react/style.css";

function App() {
  return (
    <FilloutFullScreenEmbed filloutId="foAdHjd1Duus" domain="example.com" />
  );
}

export default App;
```
