import React, { Component } from "react";
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  Button,
  BackHandler,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  ImageBackground,
  Keyboard,
  StatusBar,
  TextInput,
} from "react-native";
import Theme from "../../../Themes/Default";
import ApiUrl from "../../../constants/ApiUrl";
import { WebView } from "react-native-webview";
import Toolbar from "../../../components/Toolbar";
import HttpUtils from "../../../Utils/HttpUtils";
import SMX from "../../../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../../Stores/GlobalStore";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import GlobalCache from "../../../Caches/GlobalCache";
import QuickValuationDto from "../../../DtoParams/QuickValuationDto";
import DropDownBox from "../../../components/DropDownBox";
import SystemParameter from "../../../Entities/SystemParameter";
import { TextInputMask } from "react-native-masked-text";
import { ClientMessage } from "../../../SharedEntity/SMXException";
import { LinearGradient } from "expo-linear-gradient";
import QuickValuationVehicle from "../../../Entities/QuickValuationVehicle";
import Utility from "../../../Utils/Utility";
import ProcessValuationDto from "../../../DtoParams/ProcessValuationDto";
import ProcessValuation from "../../../Entities/ProcessValuation";
import ProcessValuationDocument from "../../../Entities/ProcessValuationDocument";
import adm_Attachment from "../../../Entities/adm_Attachment";
import AttachmentDto from "../../../DtoParams/AttachmentDto";
import GalleryBatchLine from "../../../components/GalleryBatchLine";
import * as ImagePicker from "expo-image-picker";
import ActionMobileDto from "../../../DtoParams/ActionMobileDto";
import * as Enums from "../../../constants/Enums";
import * as Permissions from "expo-permissions";
import * as DocumentPicker from "expo-document-picker";
const { width, height } = Dimensions.get("window");
import * as FileSystem from "expo-file-system";
import ProcessValuationEquipment from "../../../Entities/ProcessValuationEquipment";
import BatchEquipmentDto from "../../../DtoParams/BatchEquipmentDto";

interface iProps {
  navigation: any;
  route: any;
  GlobalStore: GlobalStore;
}
interface iState {
  ProcessValuationDocumentID?: number;
  ProcessValuation?: ProcessValuation;
  ProcessValuationDocument?: ProcessValuationDocument;
  WorkfieldDistance?: string;
  ListWorkfieldImage?: adm_Attachment[];
  ProcessValuationEquipment?: ProcessValuationEquipment;
  RefCode?: string;
  showUpFile: boolean;
  image: any;
  imageBase64: string;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class BatchEquipmentImagesSrc extends Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      ProcessValuation: new ProcessValuation(),
      ProcessValuationDocument: new ProcessValuationDocument(),
      WorkfieldDistance: "",
      ListWorkfieldImage: [],
      RefCode: "",
      showUpFile: false,
      image: null,
      imageBase64: "",
      ProcessValuationEquipment: new ProcessValuationEquipment(),
    };
  }
  async componentDidMount() {
    await this.LoadData();
    this.props.GlobalStore.UpdateImageTrigger = () => {
      this.LoadData();
    };
  }
  _upLoadFile = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      this._handleUploadFilePicked(result);
    } catch (ex) {}
  };
  _pickImage = async () => {
    try {
      //@ts-ignore
      //status === "granted";
      // console.log("AAA");
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
  _handleUploadFilePicked = async (result) => {
    try {
      let fileBase64 = await FileSystem.readAsStringAsync(result.uri, {
        encoding: "base64",
      });
      console.log(fileBase64);
      this.props.GlobalStore.ShowLoading();
      var req = new AttachmentDto();
      var att = new adm_Attachment();
      att.RefID = this.props.route.params.MortgageAssetProductionLineDetailID;
      att.ImageBase64String = fileBase64;
      att.FileContent = fileBase64;
      att.RefCode = "BienBan_KSHT";

      if (result.uri.toString() != "") {
        let uriArray = result.uri.toString().split("/");
        if (uriArray.length > 0) {
          let filename = uriArray[uriArray.length - 1];
          att.FileName = filename;
          att.DisplayName = filename;
          att.ContentType = "application/pdf";
        }
      }
      req.Attachment = att;
      let res = await HttpUtils.post<AttachmentDto>(
        ApiUrl.Attachment_Execute,
        SMX.ApiActionCode.UploadFile,
        JSON.stringify(req)
      );
      // req.Attachment = this.state.SelectedDefault;
      // att = req.Attachment;
      // att.RefID = this.props.route.params.ProcessValuationDocumentID;
      if (!result.cancelled) {
      }
      this.LoadData();
      this.props.GlobalStore.HideLoading();
    } catch (e) {
      this.props.GlobalStore.HideLoading();
      this.props.GlobalStore.Exception = e;
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

  _handleImagePicked = async (result) => {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new AttachmentDto();
      var att = new adm_Attachment();
      att.RefID = this.props.route.params.MortgageAssetProductionLineDetailID;
      att.RefType = this.props.route.params.RefType;
      att.ImageBase64String = result.base64;
      att.FileContent = result.base64;
      console.log("MACode2", this.props.route.params.MACode2);

      if (
        this.props.route.params.MACode2 == SMX.MortgageAssetCode2.VehicleRoads
      ) {
        att.RefCode = "HinhAnh_PTVT_HinhKhac";
      } else att.RefCode = "HinhAnh_Khac";

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
      this.LoadData();
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
  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();

      var reqBatch = new BatchEquipmentDto();

      reqBatch.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      reqBatch.ProcessValuationEquipmentID = this.props.route.params.ProcessValuationEquipmentID;

      let resBatch = await HttpUtils.post<BatchEquipmentDto>(
        ApiUrl.BatchEquipment_Execute,
        SMX.ApiActionCode.GetProcessValuationEByID,
        JSON.stringify(reqBatch)
      );
      if (resBatch) {
        this.setState({
          ProcessValuationEquipment: resBatch!.ProcessValuationEquipment!,
        });
      }

      var req = new AttachmentDto();
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      req.RefID = this.props.route.params.MortgageAssetProductionLineDetailID;
      req.RefType = this.props.route.params.RefType;
      let res = await HttpUtils.post<AttachmentDto>(
        ApiUrl.Attachment_Execute,
        SMX.ApiActionCode.LoadDataBatch,
        JSON.stringify(req)
      );
      if (res) {
        this.setState({
          ListWorkfieldImage: res!.ListWorkfieldImage!,
        });
      }

      this.state.ListWorkfieldImage.forEach((element) => {
        (element.RefID = this.props.route.params.MortgageAssetProductionLineDetailID),
          (element.RefType = this.props.route.params.RefType);
      });
      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_KhaoSatTaiSan() {
    try {
      this.props.GlobalStore.ShowLoading();
      // let res = await HttpUtils.post<QuickValuationDto>(
      //     ApiUrl.QuickValuation_Execute,
      //     SMX.ApiActionCode.SetupViewVehicleForm,
      //     JSON.stringify(new QuickValuationDto())
      // );

      // if (res) {
      //     this.setState({
      //     });
      // }
      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.HideLoading();
      this.props.GlobalStore.Exception = ex;
    }
  }
  async Complete() {
    try {
      this.props.GlobalStore.ShowLoading();
      let req = new BatchEquipmentDto();
      let item = this.state.ProcessValuationEquipment;
      let pvE = new ProcessValuationEquipment();
      pvE.ProcessValuationEquipmentID = item.ProcessValuationEquipmentID;
      pvE.IsWorkfield = true;

      req.ProcessValuationEquipment = pvE;
      let res = await HttpUtils.post<BatchEquipmentDto>(
        ApiUrl.BatchEquipment_Execute,
        SMX.ApiActionCode.SaveDataPVE,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationEquipment: res!.ProcessValuationEquipment!,
        });
      }

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }
  async btn_Save() {
    try {
      this.props.GlobalStore.ShowLoading();
      let req = new BatchEquipmentDto();
      let item = this.state.ProcessValuationEquipment;
      let pvE = new ProcessValuationEquipment();
      pvE.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      pvE.ProcessValuationEquipmentID = item.ProcessValuationEquipmentID;
      pvE.Description = item.Description;
      pvE.Model = item.Model;
      pvE.InfactSearial = item.InfactSearial;
      pvE.InfactChassisNumber = item.InfactChassisNumber;
      pvE.InfactMachineNumber = item.InfactMachineNumber;

      req.ProcessValuationEquipment = pvE;
      let res = await HttpUtils.post<BatchEquipmentDto>(
        ApiUrl.BatchEquipment_Execute,
        SMX.ApiActionCode.SaveDataPVE,
        JSON.stringify(req)
      );

      console.log(res);

      if (res) {
        this.setState({
          ProcessValuationEquipment: res!.ProcessValuationEquipment!,
        });
      }

      this.props.GlobalStore.HideLoading();
      let mess = "Lưu thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }
  render() {
    let pvE = this.state.ProcessValuationEquipment;
    return (
      <View style={{ height: height, backgroundColor: "#F6F6FE" }}>
        <Toolbar
          Title="Khảo sát hiện trạng - Hình ảnh"
          navigation={this.props.navigation}
        />
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingHorizontal: 8 }}
          >
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <LinearGradient
                  colors={["#7B35BB", "#5D2E86"]}
                  style={{
                    width: width / 3,
                    height: 40,
                    backgroundColor: "#007AFF",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <FontAwesome5 name="file-alt" size={18} color="#FFFFFF" />
                  <Text
                    style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                  >
                    Khảo sát TS
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <LinearGradient
                  colors={["#FFFFFF", "#FFFFFF"]}
                  style={{
                    width: width / 3 - 40,
                    height: 40,
                    backgroundColor: "#FFFFFF",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: 15,
                    borderColor: "#ddd",
                    borderRadius: 5,
                    borderWidth: 1,
                  }}
                >
                  <FontAwesome5 name="times" size={18} color="#000000" />
                  <Text
                    style={{ color: "#000000", fontSize: 15, marginLeft: 8 }}
                  >
                    Thoát
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}
                >
                  I. THÔNG TIN KHÁCH HÀNG
                </Text>
              </View>
                <View style={Theme.ViewContent}>
                  <View style={styles.Item}>
                    <View style={{ flex: 5, flexDirection: "row" }}>
                      <Text style={{ flex: 2 }}>Tên KH: </Text>
                      <Text style={{ flex: 3, fontWeight: "600" }}>
                      {this.props.route.params.CustomerName} 
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#F0F0F4",
                      marginVertical: 8,
                    }}
                  ></View>
                  <View style={styles.Item}>
                    <View style={{ flex: 5, flexDirection: "row" }}>
                      <Text style={{ flex: 2 }}>Địa chỉ trên GCN: </Text>
                      <Text style={{ flex: 3, fontWeight: "600" }}>
                      {this.props.route.params.InfactAddress} 
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#F0F0F4",
                      marginVertical: 8,
                    }}
                  ></View>

                  <View style={styles.Item}>
                    <View style={{ flex: 5, flexDirection: "row" }}>
                      <Text style={{ flex: 2 }}>Tên hệ thống/Bộ chứng từ </Text>
                      <Text style={{ flex: 3, fontWeight: "600" }}>
                        {this.props.route.params.Name}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#F0F0F4",
                      marginVertical: 8,
                    }}
                  ></View>
                  <View style={styles.Item}>
                    <View style={{ flexDirection: "row", flex: 2 }}>
                      <Text>Serial </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                      <TextInput
                        multiline={false}
                        style={[Theme.TextView]}
                        value={pvE.InfactSearial}
                        onChangeText={(val) => {
                          pvE.InfactSearial = val;
                          this.setState({ ProcessValuationEquipment: pvE });
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#F0F0F4",
                      marginVertical: 8,
                    }}
                  ></View>
                  <View style={styles.Item}>
                    <View style={{ flexDirection: "row", flex: 2 }}>
                      <Text>Model </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                      <TextInput
                        multiline={false}
                        style={[Theme.TextView]}
                        value={pvE.Model}
                        onChangeText={(val) => {
                          pvE.Model = val;
                          this.setState({ ProcessValuationEquipment: pvE });
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#F0F0F4",
                      marginVertical: 8,
                    }}
                  ></View>
                  <View style={styles.Item}>
                    <View style={{ flexDirection: "row", flex: 2 }}>
                      <Text>Số máy </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                      <TextInput
                        multiline={false}
                        style={[Theme.TextView]}
                        value={pvE.InfactChassisNumber}
                        onChangeText={(val) => {
                          pvE.InfactChassisNumber = val;
                          this.setState({ ProcessValuationEquipment: pvE });
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#F0F0F4",
                      marginVertical: 8,
                    }}
                  ></View>

                  <View style={styles.Item}>
                    <View style={{ flexDirection: "row", flex: 2 }}>
                      <Text>Số khung </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                      <TextInput
                        multiline={false}
                        style={[Theme.TextView]}
                        value={pvE.InfactMachineNumber}
                        onChangeText={(val) => {
                          pvE.InfactMachineNumber = val;
                          this.setState({ ProcessValuationEquipment: pvE });
                        }}
                      />
                    </View>
                  </View>
                </View>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#F0F0F4",
                marginVertical: 8,
              }}
            />
            <View style={styles.TextAndDrop}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Mô tả tài sản </Text>
              </View>
              <View style={{ flex: 3 }}>
                <TextInput
                  numberOfLines={4}
                  multiline={true}
                  textAlignVertical="top"
                  style={[Theme.TextView, { height: 75 }]}
                  value={pvE.Description}
                  onChangeText={(val) => {
                    pvE.Description = val;
                    this.setState({ ProcessValuationEquipment: pvE });
                  }}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#7ba6c2",
                borderRadius: 5,
                borderWidth: 1,
                marginVertical: 8,
                paddingVertical: 12,
              }}
            >
              <GalleryBatchLine
                navigation={this.props.navigation}
                Images={this.state.ListWorkfieldImage}
                numberColumn={2}
                allowEdit={true}
                allowRemove={true}
              />
            </View>

            <View
              style={{
                marginVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => {
                  this.btn_Save();
                }}
              >
                <LinearGradient
                  colors={["#7B35BB", "#5D2E86"]}
                  style={{
                    width: width / 3 + 8,
                    height: 40,
                    backgroundColor: "#007AFF",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <FontAwesome5 name="file-alt" size={15} color="#FFFFFF" />
                  <Text
                    style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                  >
                    Lưu
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => {
                  this.Complete();
                }}
              >
                <LinearGradient
                  colors={["#7B35BB", "#5D2E86"]}
                  style={{
                    width: width / 3 - 20,
                    height: 40,
                    backgroundColor: "#007AFF",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <FontAwesome
                    name="flag-checkered"
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text
                    style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                  >
                    Hoàn thành
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => {
                  this._pickImage();
                }}
              >
                <LinearGradient
                  colors={["#7B35BB", "#5D2E86"]}
                  style={{
                    width: width / 3 - 32,
                    height: 40,
                    backgroundColor: "#007AFF",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <FontAwesome name="file-image-o" size={15} color="#FFFFFF" />
                  <Text
                    style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                  >
                    Thêm ảnh
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Item: {
    flexDirection: "row",
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "space-between",
  },
  Item123: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "gainsboro",
    borderBottomWidth: 1,
  },
  ItemNote: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  TextAndDrop: {
    marginTop: 10,
  },
});
