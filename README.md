# Hayer React Image Crop

An image cropping tool for React.
based on npm package "react-image-crop"

![Demo](https://raw.githubusercontent.com/emmyhayer/hayer-react-image-crop/master/demo.gif)

## Installation

```
npm i hayer-react-image-crop --save

yarn add hayer-react-image-crop --save
```

## Usage

Include the main js module:

```js
import HayerImageCrop from 'hayer-react-image-crop';
import 'hayer-react-image-crop/style.css';
```

## Example

```jsx
<HayerImageCrop
  onImageCrop={(img) => {console.log(img)}}
  error={(err) => alert(err)}
  aspect={4/4}
  unit="px"
  width={256}
  src="https://pbs.twimg.com/media/DM9sVVUV4AAQ8Bx.jpg"
/>
```

## Props

| Command | Description | Default Props|
| --- | --- | --- |
| `aspect` | aspect ratio for your image | 16 / 9 |
| `unit` | crop property **%** or **px** | % |
| `width` | width for crop in **px** or **%** | 30 |
| `height` | height for crop in **px** or **%** | null |
| `src` | in **src** you can pass your existing image src to view | null |
| `onImageCrop` | onImageCrop() return base64 croped image | -- |
| `error` | error() throw error if image format is not **jpg** or **png** | -- |