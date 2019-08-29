import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import { Grid, Header, Image, Modal, Button } from 'semantic-ui-react'
import Svg from './Svg'
// import 'semantic-ui-css/semantic.min.css';
// import './ImageCrop.css';
// import "react-image-crop/dist/ReactCrop.css";

export default class ImageCrop extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      src: null,
      crop: {
        unit: props.unit || undefined,
        width: props.width || undefined,
        height: props.height || undefined,
        aspect: props.aspect || 16 / 9
      },
      thumbnail: props.src || null,
      base64Image: null
    };
    this.onSelectFile                         = this.onSelectFile.bind(this);
    this.onImageLoaded                        = this.onImageLoaded.bind(this);
    this.onCropComplete                       = this.onCropComplete.bind(this);
    this.onCropChange                         = this.onCropChange.bind(this);
    this.makeClientCrop                       = this.makeClientCrop.bind(this);
    this.getCroppedImg                        = this.getCroppedImg.bind(this);
    this._removePicture                       = this._removePicture.bind(this);
    this._close                               = this._close.bind(this);
    this._crop                                = this._crop.bind(this);
    this._change                              = this._change.bind(this);
    this.UNSAFE_componentWillReceiveProps     = this.UNSAFE_componentWillReceiveProps.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(this.props.src !== nextProps.src) {
      this.setState({
        croppedImageUrl: nextProps.src
      })
    }
  }

  onSelectFile(e) {
    console.log(this.state);
    if (e.target.files && e.target.files.length > 0) {
      const picture = e.target.files[0];
      const pictureExt = picture.name.split('.').pop();
      const allow = ['jpg', 'jpeg', 'JPG', 'JPEG', 'png', 'PNG'];
      if (!allow.includes(pictureExt)) {
        this.props.error('Upload only jpg or png image')
        return false;
      }
      this.setState({ show: true });
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded(image) {
    this.imageRef = image;
  };

  onCropComplete(crop) {
    this.makeClientCrop(crop);
  };

  onCropChange(crop, percentCrop) {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
      this.props.onImageCrop(croppedImageUrl);
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const self = this;

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
          const base64Image = reader.result;
          self.setState({ base64Image})
        }

        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  _removePicture() {
    this.props.onImageCrop('');
    this.setState({
      src: null,
      croppedImageUrl: null,
      thumbnail: null
    });
  }

  _close() {
    document.getElementById("mi-image-input").value = "";
    this.setState({
      show: false,
      src: null
    });
  }
  _crop() {
    document.getElementById("mi-image-input").value = "";
    const { croppedImageUrl, base64Image } = this.state;
    this.setState({
      show: false,
      thumbnail: croppedImageUrl,
      src: null
    });
    this.props.onImageCrop(base64Image);
  }

  _change() {
    // document.getElementById("mi-image-input").focus();
  }

  render() {
    const { crop, croppedImageUrl, src, thumbnail, show } = this.state;

    return (
      <div className="App">
        <Modal open={show}>
          <Modal.Header>Crop Image</Modal.Header>
          <Modal.Content className="cropper-main-content">
            <Modal.Description>
            <Header>Select Or Drag</Header>
              <Grid>
                <Grid.Column width={10}>
                  <ReactCrop
                    src={src}
                    crop={crop}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                  />
                </Grid.Column>
                <Grid.Column width={6}>
                  <Image wrapped size='medium' src={croppedImageUrl} />
                </Grid.Column>
              </Grid>
            </Modal.Description>
            <Grid>
                <Grid.Column width={16} className="footer-bottom">
                  <Button onClick={this._crop} className="primary">Crop</Button>
                  <Button onClick={this._close} className="secondary">Cancel</Button>
                </Grid.Column>
              </Grid>
          </Modal.Content>
        </Modal>
        <div className={thumbnail ? 'mi-input-file uploaded-img-src' : 'mi-input-file'}>
          <input
            type="file"
            onChange={this.onSelectFile}
            readOnly
            id="mi-image-input"
          />
          <Svg name="upload" />
          <p>Drag &amp; drop your photo here or  <span>browse for a file</span></p>
          {thumbnail &&
          <div className='mi-img-box'>
            <div className='close' onClick={this._removePicture}>
              <Svg name="close" />
            </div>
            <Image src={thumbnail} />
            <Button primary type="button" className='btn-sm'>Change Image</Button>
          </div>
          }
        </div>
      </div>
    );
  }
}
