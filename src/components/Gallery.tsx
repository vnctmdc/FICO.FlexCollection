import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  FlatList,
  Alert
} from "react-native";
import adm_Attachment from "../Entities/adm_Attachment";
import ApiUrl from "../constants/ApiUrl";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ImageViewer from "react-native-image-zoom-viewer";
import GlobalCache from "../Caches/GlobalCache";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Permissions from "expo-permissions";
import SMX from "../constants/SMX";
import AttachmentDto from "../DtoParams/AttachmentDto";
import GlobalStore from "../Stores/GlobalStore";
import { inject, observer } from "mobx-react";

const { width, height } = Dimensions.get("window");
import HttpUtils from "../Utils/HttpUtils";

interface iProps {
  navigation: any;
  Images: adm_Attachment[];
  numberColumn: number;
  allowEdit?: boolean;
  allowRemove?: boolean;
  IsHasSoDoVeTinh?:boolean;
  IsHasSoDoQuyHoach?:boolean;
  AttachmentSoDoVeTinh?:adm_Attachment;
  AttachmentSoDoQuyHoach?:adm_Attachment;
  parentHandleEdit?: (attachment: adm_Attachment) => void;
  parentHandleRemove?: (attachment: adm_Attachment) => void;
  GlobalStore?: GlobalStore;
}
interface iState {
  SelectedFullScreen: adm_Attachment;
  SelectedDefault: adm_Attachment;
  IsHasSoDoVeTinh: boolean;
  IsHasSoDoQuyHoach: boolean;
  LstImg: any;
  SoDoVeTinh: adm_Attachment;
  SoDoQuyHoach:adm_Attachment;
}
@inject(SMX.StoreName.GlobalStore)
@observer
export default class Gallery extends React.Component<iProps, iState> {
  constructor(props: iProps) {
    super(props);
    this.state = {
      SelectedFullScreen: null,
      SelectedDefault: null,
      IsHasSoDoVeTinh: null,
      IsHasSoDoQuyHoach: null,
      SoDoVeTinh:null,
      SoDoQuyHoach:null,
      LstImg: [],
    };
  }

  async handleEdit(attachment: adm_Attachment) {
    try {
      //@ts-ignore
      //status === "granted";
    
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
      });
      this._handleImagePickedEdit(result,attachment);
    } catch (ex) {}
  }

  _handleImagePickedEdit = async (result,attachment:adm_Attachment) => {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new AttachmentDto();
      var att = new adm_Attachment();
      att = attachment;
      att.ImageBase64String = result.base64;
      att.FileContent = result.base64;

      if (result.uri.toString() != "") {
        let uriArray = result.uri.toString().split("/");
        if (uriArray.length > 0) {
          let filename = uriArray[uriArray.length - 1];
          att.FileName = filename;
          att.DisplayName = filename;

          let fileExternal = filename.split(".")[1];
          att.ContentType = "image/" + fileExternal;
        }
      }
      req.Attachment = att;
      console.log(req.Attachment);
      let res = await HttpUtils.post<AttachmentDto>(
        ApiUrl.Attachment_Execute,
        SMX.ApiActionCode.UploadImage,
        JSON.stringify(req)
      );

      // req.Attachment = this.state.SelectedDefault;
      // att = req.Attachment;
      // att.RefID = this.props.route.params.ProcessValuationDocumentID;
      if (!result.cancelled) {
      }
      this.props.GlobalStore.UpdateImageTrigger();
    } catch (e) {
      // console.log({ uploadResponse });
      // console.log({ uploadResult });
      // console.log({ e });
      // alert("Upload failed, sorry :(");
    } finally {
      this.setState({
        // uploading: false
      });
    }
  };

  async handleRemove(attachment: adm_Attachment) {
    try {
      var req = new AttachmentDto();
      req.Attachment = attachment;
      let res = await HttpUtils.post<AttachmentDto>(
        ApiUrl.Attachment_Execute,
        SMX.ApiActionCode.DeletedImage,
        JSON.stringify(req)
      );
     
      // this.props.navigation.navigate("REResidentialImagesSrc");
      this.setState({ SelectedFullScreen: null })
      this.props.GlobalStore.UpdateImageTrigger();
    } catch (ex) {}
  }




  // handleRemove(attachment: adm_Attachment) {
  //   this.props.parentHandleRemove(attachment);
  //   //this.setState({SelectedFullScreen:null});
  // }

  checkIsNotImage(img: adm_Attachment) {
    let result = false;
    if (img.FileName && img.FileName !== null && img.FileName !== "") {
      let ext = img.FileName.split(".");
      if (
        ext &&
        ext.length > 0 &&
        (ext[1] === "pdf" || ext[1] === "xlsx" || ext[1] === "docx")
      ) {
        result = true;
        return result;
      }
    }

    return false;
  }
  _pickImage = async () => {
    try {
      //@ts-ignore
      //status === "granted";
      // let { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      // if (status !== "granted") {
      //   return;
      // }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
      });
      this._handleImagePicked(result);
    } catch (ex) {}
  };
  _handleImagePicked = async (result) => {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new AttachmentDto();
      var att = new adm_Attachment();
      att = this.state.SelectedDefault;
      att.ImageBase64String = result.base64;
      att.FileContent = result.base64;

      if (result.uri.toString() != "") {
        let uriArray = result.uri.toString().split("/");
        if (uriArray.length > 0) {
          let filename = uriArray[uriArray.length - 1];
          att.FileName = filename;
          att.DisplayName = filename;

          let fileExternal = filename.split(".")[1];
          att.ContentType = "image/" + fileExternal;
        }
      }
      req.Attachment = att;
      let res = await HttpUtils.post<AttachmentDto>(
        ApiUrl.Attachment_Execute,
        SMX.ApiActionCode.UploadImage,
        JSON.stringify(req)
      );
      // req.Attachment = this.state.SelectedDefault;
      // att = req.Attachment;
      // att.RefID = this.props.route.params.ProcessValuationDocumentID;
      if (!result.cancelled) {
      }
      this.props.GlobalStore.HideLoading();
    } catch (e) {
      // console.log({ uploadResponse });
      // console.log({ uploadResult });
      // console.log({ e });
      // alert("Upload failed, sorry :(");
    } finally {
      this.setState({
        // uploading: false
      });
    }
  };
  _pickImageSDVT = async (a: number) => {
    try {
      //@ts-ignore
      //status === "granted";
      // let { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      // if (status !== "granted") {
      //   return;
      // }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
      });
      this._handleImagePickedSDVT(a,result);
    } catch (ex) {}
  };
  _handleImagePickedSDVT = async (a,result) => {
    try {
      var req = new AttachmentDto();
      var att = new adm_Attachment();
      att.ImageBase64String = result.base64;
      att.FileContent = result.base64;
      this.props.Images.forEach(element => {
        att.RefID = element.RefID,
        att.RefType = 1
      });

      console.log("test",att);

      if (result.uri.toString() != "") {
        let uriArray = result.uri.toString().split("/");
        if (uriArray.length > 0) {
          let filename = uriArray[uriArray.length - 1];
          att.FileName = filename;
          att.DisplayName = filename;
          if(a == 2)
          {
            att.RefCode = "SoDoQuyHoach";
          }
          if(a == 1)
          {
            att.RefCode = "SoDoVeTinh";
          }
          let fileExternal = filename.split(".")[1];
          att.ContentType = "image/" + fileExternal;
        }
      }
      req.Attachment = att;
      let res = await HttpUtils.post<AttachmentDto>(
        ApiUrl.Attachment_Execute,
        SMX.ApiActionCode.UploadImage,
        JSON.stringify(req)
      );
      // req.Attachment = this.state.SelectedDefault;
      // att = req.Attachment;
      // att.RefID = this.props.route.params.ProcessValuationDocumentID;
      if (!result.cancelled) {
      }
      this.props.GlobalStore.UpdateImageTrigger();
    } catch (e) {
      // console.log({ uploadResponse });
      // console.log({ uploadResult });
      // console.log({ e });
      // alert("Upload failed, sorry :(");
    } finally {
      this.setState({
        // uploading: false
      });
    }
  };

  renderImage(image: adm_Attachment) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (image.FileContent != null) {
            this.setState({ SelectedFullScreen: image });
          } else {
            this.setState({ SelectedDefault: image });
            this._pickImage();
          }
        }}
      >
        {image.FileContent != null ? (
          <Image
            source={{
              uri: "data:image/png;base64," + image.FileContent,
              //uri: `${ApiUrl.Attachment_ImagePreview}?id=${image.AttachmentID}&ecm=${image.ECMItemID}&name=${image.FileName}&size=1&token=${GlobalCache.UserToken}`,
            }}
            style={{
              borderRadius: 8,
              margin: 5,
              width: width / this.props.numberColumn - 19,
              height: width / this.props.numberColumn - 19,
              resizeMode: "cover",
            }}
          />
        ) : (
          <Image
            source={require("../../assets/notfound.png")}
            style={{
              borderRadius: 8,
              margin: 5,
              width: width / this.props.numberColumn - 19,
              height: width / this.props.numberColumn - 19,
              resizeMode: "cover",
            }}
          />
        )}
        <View
          style={{
            //borderWidth: 1,
            //borderColor: "gainsboro",
            flexDirection: "row",
            alignItems: "center",
            width: width / this.props.numberColumn - 19,
            justifyContent: "center",
            paddingLeft: 10,
            paddingBottom: 5,
            //margin: 5,
          }}
        >
          <Text
            style={{
              //margin: 5,
              fontWeight: "bold",
              color: "#1C4694",
              width: width / this.props.numberColumn - 100,
              textAlign: "center",
            }}
          >
            {image.DocumentName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.IsHasSoDoVeTinh == true ? (
          
          <TouchableOpacity onPress={() => {
            if (this.props.AttachmentSoDoVeTinh.FileContent != null) {
              this.setState({ SelectedFullScreen: this.props.AttachmentSoDoVeTinh });
            } else {
              this.setState({ SelectedDefault: this.props.AttachmentSoDoVeTinh });
              this._pickImageSDVT(1);
            }
          }}>
            {this.props.AttachmentSoDoVeTinh.FileContent != null ? (
          <Image
            source={{
              uri: "data:image/png;base64," + this.props.AttachmentSoDoVeTinh.FileContent,
              //uri: `${ApiUrl.Attachment_ImagePreview}?id=${image.AttachmentID}&ecm=${image.ECMItemID}&name=${image.FileName}&size=1&token=${GlobalCache.UserToken}`,
            }}
            style={{
              borderRadius: 8,
              margin: 5,
              width: width / 1 - 19,
              height: width / this.props.numberColumn - 19,
              resizeMode: "cover",
            }}
          />
        ) : (
            <Image
              source={require("../../assets/notfound.png")}
              style={{
                borderRadius: 8,
                width: width / 1 - 19,
                height: width / this.props.numberColumn - 19,
                resizeMode: "cover",
              }}
            /> )}
            <Text
              style={{
                //margin: 5,
                fontWeight: "bold",
                color: "#1C4694",
                textAlign: "center",
              }}
            >
              Sơ đồ vệ tinh
            </Text>
          </TouchableOpacity>
        ) : undefined}
        {this.props.IsHasSoDoQuyHoach == true ? (
          <TouchableOpacity onPress={() => {
            if (this.props.AttachmentSoDoQuyHoach.FileContent != null) {
              this.setState({ SelectedFullScreen: this.props.AttachmentSoDoQuyHoach });
            } else {
              this.setState({ SelectedDefault: this.props.AttachmentSoDoQuyHoach });
              this._pickImageSDVT(2);
            }
          }}>
                  {this.props.AttachmentSoDoQuyHoach.FileContent != null ? (
          <Image
            source={{
              uri: "data:image/png;base64," + this.props.AttachmentSoDoQuyHoach.FileContent,
              //uri: `${ApiUrl.Attachment_ImagePreview}?id=${image.AttachmentID}&ecm=${image.ECMItemID}&name=${image.FileName}&size=1&token=${GlobalCache.UserToken}`,
            }}
            style={{
              borderRadius: 8,
              margin: 5,
              width: width / 1 - 19,
              height: width / this.props.numberColumn - 19,
              resizeMode: "cover",
            }}
          />
        ) : (
            <Image
              source={require("../../assets/notfound.png")}
              style={{
                borderRadius: 8,
                width: width / 1 - 19,
                height: width / this.props.numberColumn - 19,
                resizeMode: "cover",
              }}
            />)}
            <Text
              style={{
                //margin: 5,
                fontWeight: "bold",
                color: "#1C4694",
                textAlign: "center",
              }}
            >
              Sơ đồ quy hoạch
            </Text>
          </TouchableOpacity>
        ) : undefined}
        <FlatList
          data={this.props.Images}
          numColumns={this.props.numberColumn}
          renderItem={({ item, index }) => this.renderImage(item)}
          keyExtractor={(item, index) => index.toString()}
        />
        {this.state.SelectedFullScreen != null ? (
          <Modal visible={true}>
            {/* <Image
                            source={{
                                uri: 'data:image/png;base64,' + this.state.SelectedFullScreen.FileContent
                                //uri:                                    
                                //    ApiUrl.Attachment_ImagePreview +
                                //    `?id=${this.state.SelectedFullScreen.AttachmentID}&name=${this.state.SelectedFullScreen.FileName}&ecm=${this.state.SelectedFullScreen.ECMItemID}&size=3`
                            }}
                            style={{ width: width, height: height, resizeMode: "contain" }}
                        /> */}
            <ImageViewer
              imageUrls={[
                {
                  url:
                    "data:image/png;base64," +
                    this.state.SelectedFullScreen.FileContent,
                },
              ]}
              backgroundColor={"white"}
              renderIndicator={() => null}
            />
            {/* <ImageViewer
                            imageUrls={[
                                {
                                    url: `${ApiUrl.Attachment_ImagePreview}?id=${this.state.SelectedFullScreen.AttachmentID}&ecm=${this.state.SelectedFullScreen.ECMItemID}&name=${this.state.SelectedFullScreen.FileName}&size=0&token=${GlobalCache.UserToken}`,
                                },
                            ]}
                            backgroundColor={"white"}
                            renderIndicator={() => null}
                        /> */}
            <View
              style={{
                position: "absolute",
                zIndex: 999999999,
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 30,
              }}
            >
              <TouchableOpacity
                //@ts-ignore
                style={{
                  justifyContent: "space-around",
                  alignItems: "center",
                  backgroundColor: "#7B35BB",
                  //backgroundColor: "rgba(0, 0, 0, 0.5)",
                  height: 40,
                  marginLeft: 15,
                  padding: 10,
                  borderRadius: 50,
                }}
                onPress={() => this.setState({ SelectedFullScreen: null })}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5 name="arrow-left" size={20} color={"white"} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginLeft: 15,
                      color: "white",
                    }}
                  >
                    Back
                  </Text>
                </View>
              </TouchableOpacity>
              {this.props.allowEdit != null && this.props.allowEdit ? (
                <TouchableOpacity
                  //@ts-ignore
                  style={{
                    backgroundColor: "#7B35BB",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    marginLeft: 15,
                    padding: 10,
                    borderRadius: 50,
                  }}
                  onPress={() => this.handleEdit(this.state.SelectedFullScreen)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5 name="edit" size={20} color={"white"} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        marginLeft: 15,
                        color: "white",
                      }}
                    >
                      Sửa
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : undefined}
              {this.props.allowRemove != null && this.props.allowRemove ? (
                <TouchableOpacity
                  //@ts-ignore
                  style={{
                    backgroundColor: "#7B35BB",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    marginLeft: 15,
                    padding: 10,
                    borderRadius: 50,
                  }}
                  onPress={() => {
                    this.handleRemove(this.state.SelectedFullScreen);
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5 name="trash" size={20} color={"white"} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        marginLeft: 15,
                        color: "white",
                      }}
                    >
                      Xóa
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : undefined}
            </View>
          </Modal>
        ) : undefined}
      </View>
    );
  }
}
