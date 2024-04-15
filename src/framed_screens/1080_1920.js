import React, { Component } from "react";
import axios from "axios";
import './1080_1920.css';

const style = { backgroundImage: 'url(/backgrounds/1080_1920.png)' };

class _1080_1920 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            video: "",
            skip: 0,
            first: true,
            visibleVideo: 'video',
            firstLoad: false,
        };
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.firstLoadVideo();
        this.interval = setInterval(this.loadVideo, 15000);
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
        clearInterval(this.interval);
    }

    componentDidUpdate() {
        console.log(['this.state.skip', this.state.skip, 'this.state.visibleVideo', this.state.visibleVideo])
        let visibleVideo = this.state.visibleVideo;
        if (this.state.skip == 2) {
            visibleVideo = 'video';
        }
        if (!this.state.firstLoad) {
            document.getElementById('video').hidden = visibleVideo !== 'video';
            document.getElementById('video2').hidden = visibleVideo !== 'video2';
        }
    }

    setNextVisibleVideo = (visibleVideo) => {
        return visibleVideo === 'video' ? 'video2' : 'video';
    }

    getVisibleElement = (visibleVideo, first) => {
        let newVisibleElement = visibleVideo;
        return document.getElementById(newVisibleElement);
    }

    loadVideo = () => {
        console.log('loadVideo')
        const { skip, first } = this.state;
        axios.post("https://www.tesvik-sgk.com/signal/api/video/getVideo", { skip })
            .then((res) => {
                if (res?.data?.status === true) {
                    const videoElement = this.getVisibleElement(this.state.visibleVideo, this.state.first)
                    videoElement.src = res?.data?.video?.data;
                    videoElement.load();
                    this.setState(prevState => ({
                        skip: res?.data?.count,
                        first: false,
                        visibleVideo: this.setNextVisibleVideo(prevState.visibleVideo),
                        firstLoad: false
                    }));
                    if (first) {
                        videoElement.hidden = false; // İlk gelen video hidden özelliğini kaldır
                    }
                } else {
                    alert('Video yüklenirken hata oluştu')
                }
            })
            .catch((err) => {
                alert("Video yüklenirken hata oluştu");
                console.log(err);
            })
    }

    firstLoadVideo = () => {
        console.log('firstLoadVideo')
        const { skip, first } = this.state;
        axios.post("https://www.tesvik-sgk.com/signal/api/video/getVideo", { skip })
            .then((res) => {
                if (res?.data?.status === true) {
                    const videoElement = document.getElementById('video');
                    videoElement.src = res?.data?.video?.data;
                    videoElement.load();
                    this.setState(() => ({
                        skip: res?.data?.count,
                        first: false,
                        firstLoad: true
                    }));
                    if (first) {
                        videoElement.hidden = false; // İlk gelen video hidden özelliğini kaldır
                    }
                } else {
                    alert('Video yüklenirken hata oluştu')
                }
            })
            .catch((err) => {
                alert("Video yüklenirken hata oluştu");
                console.log(err);
            })
    }

    render() {
        return (
            <div id="bg" className="bg" style={style}>
                <video id="video" loop className="video" height="1516.8" width="708.48" autoPlay="true" muted="true"></video>
                <video id="video2" loop className="video" height="1516.8" width="708.48" autoPlay="true" muted="true"></video>
                <div className="hole"></div>
            </div>
        );
    }
}

export default _1080_1920;