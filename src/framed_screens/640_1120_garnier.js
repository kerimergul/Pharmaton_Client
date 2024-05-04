import React, { Component } from "react";
import axios from "axios";
import '../styles/640_1120.css';
import '../styles/serial.css';

const style = { backgroundImage: 'url(/backgrounds/bottom_640_1120.png)' };
const styleTop = { backgroundImage: 'url(/backgrounds/top_640_1120.png)' };

class _640_1120_Garnier extends Component {
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
        this.interval = setInterval(this.loadimage, 20000);
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
            axios.post("https://www.tesvik-sgk.com/signal/api/image/getImage", { skip })
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
                            }));
                        } else {
                            this.setState(prevState => ({
                                skip: res?.data?.count,
                                first: false,
                                visibleimage: this.setNextVisibleimage(prevState.visibleimage),
                                firstLoad: false,
                                loading: false,
                                updateScreen: true
                            }));
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
            axios.post("https://www.tesvik-sgk.com/signal/api/image/getImage", { skip })
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

    render() {
        return (
            <div id="bg" className="bg" style={style}>
                <img id="image" className="image_640_1120" height="1" width="1120"></img>
                <img id="image2" className="image_640_1120" height="1" width="1120"></img>
                <div className="hole"></div>
                <div id="top" className="top" style={styleTop} />
                {/* <div id="serial" class="serial">MAT-TR-2400608</div> */}
            </div>
        );
    }
}

export default _640_1120_Garnier;