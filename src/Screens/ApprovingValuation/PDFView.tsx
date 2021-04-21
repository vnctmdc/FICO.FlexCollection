import React from "react";
import { View, Text, Platform } from "react-native";
import Theme from "../../Themes/Default";
import { WebView } from "react-native-webview";
import ApiUrl from "../../constants/ApiUrl";
import GlobalCache from "../../Caches/GlobalCache";
import GlobalStore from "../../Stores/GlobalStore";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import Toolbar from "../../components/Toolbar";
import PDFReader from "rn-pdf-reader-js";

interface iProps {
    GlobalStore: GlobalStore;
    route: any;
    navigation: any;
}

interface iState {}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class PDFView extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {};
    }

    render() {
        // console.log(1, this.props.route.params.AttachmentID);
        // console.log(2, this.props.route.params.ECMItemID);
        // console.log(3, this.props.route.params.FileName);
        // console.log(4, GlobalCache.UserToken);

        //console.log(`${ApiUrl.Attachment_PDFView}?id=${this.props.route.params.AttachmentID}&ecm=${this.props.route.params.ECMItemID}&name=${this.props.route.params.FileName}&size=1&token=${GlobalCache.UserToken}`);
        
        // console.log(
        //     `https://drive.google.com/viewerng/viewer?embedded=true&url=${ApiUrl.Attachment_PDFView}?id=${this.props.route.params.AttachmentID}&ecm=${this.props.route.params.ECMItemID}&name=${this.props.route.params.FileName}&size=1&token=${GlobalCache.UserToken}`
        // );
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                <Toolbar Title={ this.props.route.params.Title != null? this.props.route.params.Title : "Báo cáo định giá"} navigation={this.props.navigation}></Toolbar>
                <View
                    style={{
                        //paddingHorizontal: 10,
                        flex: 1,
                        backgroundColor: "#F6F6FE",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                >
                    {Platform.OS == "ios" ? (
                        <WebView
                            //scrollEnabled={true}
                            onLoadStart={() => this.props.GlobalStore.ShowLoading()}
                            onLoadEnd={() => this.props.GlobalStore.HideLoading()}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            source={{
                                uri: `${ApiUrl.Attachment_PDFView}?id=${this.props.route.params.AttachmentID}&ecm=${this.props.route.params.ECMItemID}&name=${this.props.route.params.FileName}&size=1&token=${GlobalCache.UserToken}`,
                            }}
                        />
                    ) : (
                        <PDFReader
                            source={{
                                uri: `${ApiUrl.Attachment_PDFView}?id=${this.props.route.params.AttachmentID}&ecm=${this.props.route.params.ECMItemID}&name=${this.props.route.params.FileName}&size=1&token=${GlobalCache.UserToken}`,
                            }}
                        />
                    )}
                </View>
            </View>
        );
    }
}
