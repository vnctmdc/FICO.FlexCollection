import React, { Component, RefObject } from "react";
import { WebView } from "react-native-webview";

interface iProps {
    runTime: number;
    task: any;
}
export default class BackgroundTaskRunner extends React.Component<iProps, any> {
    render() {
        return (
            <WebView
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={this.props.task}
                source={{
                    html: `
                    <script>
                        setInterval(() => {
                            window.ReactNativeWebView.postMessage("");
                        }, ${this.props.runTime})
                    </script>`,
                }}
            />
        );
    }
}
