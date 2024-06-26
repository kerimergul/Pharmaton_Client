import React, { Component } from "react";
import axios from "axios";
import html2canvas from 'html2canvas';
import '../styles/1080_1920.css';
import '../styles/serial.css';

const style = { backgroundImage: 'url(/backgrounds/bottom_layer.png)' };
const styleTop = { backgroundImage: 'url(/backgrounds/top_layer.png)' };

class _1080_1920_Download extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            skip: 1,
            first: true,
            visibleimage: 'image2',
            firstLoad: true,
            loading: false,
            updateScreen: true,
        };
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.firstLoadimage();
        this.interval = setInterval(this.loadimage, 5000);
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
        clearInterval(this.interval);
    }

    componentDidUpdate() {
        console.log(['this.state.skip', this.state.skip, 'this.state.visibleimage', this.state.visibleimage])
        let visibleimage = this.state.visibleimage;
        if (!this.state.firstLoad && this.state.updateScreen) {
            document.getElementById('image').hidden = visibleimage !== 'image';
            document.getElementById('image2').hidden = visibleimage !== 'image2';
        }
    }

    setNextVisibleimage = (visibleimage) => {
        return visibleimage === 'image' ? 'image2' : 'image';
    }

    getVisibleElement = (visibleimage, first) => {
        let newVisibleElement = visibleimage;
        return document.getElementById(newVisibleElement);
    }

    loadimage = () => {
        console.log('loadimage')
        const { skip, first } = this.state;
        if (!this.state.loading) {
            this.setState({ loading: true, updateScreen: false });
            let list = true;
            axios.post("https://www.tesvik-sgk.com/signal/api/image/getImage", { skip, list })
                .then((res) => {
                    if (res?.data?.status === true) {
                        const imageElement = this.getVisibleElement(this.state.visibleimage, this.state.first)
                        imageElement.src = res?.data?.image?.data;
                        // imageElement.onload = () => {
                        if (res?.data?.count == 1) {
                            this.setState(() => ({
                                skip: res?.data?.count,
                                first: false,
                                visibleimage: 'image',
                                firstLoad: false,
                                loading: false,
                                updateScreen: true
                            }), () => {
                                this.mergeAndDownloadImages();
                            });
                        } else {
                            this.setState(prevState => ({
                                skip: res?.data?.count,
                                first: false,
                                visibleimage: this.setNextVisibleimage(prevState.visibleimage),
                                firstLoad: false,
                                loading: false,
                                updateScreen: true
                            }), () => {
                                this.mergeAndDownloadImages();
                            });
                        }
                        // }

                    } else {
                        this.setState({ loading: false, updateScreen: true });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ loading: false, updateScreen: true });
                })
        }
    }

    firstLoadimage = () => {
        console.log('firstLoadimage')
        let skip = 0;
        if (!this.state.loading) {
            this.setState({ loading: true, updateScreen: false });
            let list = true;
            axios.post("https://www.tesvik-sgk.com/signal/api/image/getImage", { skip, list })
                .then((res) => {
                    if (res?.data?.status === true) {
                        const imageElement = document.getElementById('image');
                        imageElement.src = res?.data?.image?.data;
                        // imageElement.onload = function () {
                        this.setState(() => ({
                            // skip: res?.data?.count,
                            first: false,
                            loading: false,
                            updateScreen: true
                            // firstLoad: true
                        }));
                        imageElement.hidden = false;
                        // }
                    } else {
                        this.setState({ loading: false, updateScreen: true });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ loading: false, updateScreen: true });
                })
        }
    }

    mergeAndDownloadImages = () => {
        html2canvas(document.getElementById('bg')).then(canvas => {
            const link = document.createElement('a');
            link.download = `${this.state.skip}_1080_1920.jpg`;
            link.href = canvas.toDataURL('image/jpeg');
            link.click();
        });
    };

    render() {
        return (
            <div id="bg" className="bg" style={style}>
                <img id="image" className="image_1080_1920" height="1" width="1080"></img>
                <img id="image2" className="image_1080_1920" height="1" width="1080"></img>
                <div className="hole"></div>
                <div id="top_1080_1920" className="top_1080_1920" style={styleTop} />
                {/* <div id="serial" class="serial">MAT-TR-2400608</div> */}
            </div>
        );
    }
}

export default _1080_1920_Download;