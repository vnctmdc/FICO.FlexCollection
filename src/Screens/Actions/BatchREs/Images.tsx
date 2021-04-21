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
import GlobalCache from "../../../Caches/GlobalCache";
import QuickValuationDto from "../../../DtoParams/QuickValuationDto";
import DropDownBox from "../../../components/DropDownBox";
import SystemParameter from "../../../Entities/SystemParameter";
import { TextInputMask } from "react-native-masked-text";
import { ClientMessage } from "../../../SharedEntity/SMXException";
import { LinearGradient } from "expo-linear-gradient";
import Utility from "../../../Utils/Utility";
import ProcessValuationDto from "../../../DtoParams/ProcessValuationDto";
import ProcessValuation from "../../../Entities/ProcessValuation";
import ProcessValuationDocument from "../../../Entities/ProcessValuationDocument";
import AttachmentDto from "../../../DtoParams/AttachmentDto";
import adm_Attachment from "../../../Entities/adm_Attachment";
import ProcessValuationRE from "../../../Entities/ProcessValuationRE";
import * as Enums from "../../../constants/Enums";
import BatchREDto from "../../../DtoParams/BatchREDto";
import * as ImagePicker from "expo-image-picker";
import Gallery from "../../../components/Gallery";

const { width, height } = Dimensions.get("window");

interface iProps {
  navigation: any;
  route: any;
  GlobalStore: GlobalStore;
}
interface iState {
  ProcessValuationDocumentID?: number;
  MortgageAssetID?: number;
  ProcessValuationREID?: number;
  showCustomerInfo: boolean;
  ProcessValuation?: ProcessValuation;
  ProcessValuationDocument?: ProcessValuationDocument;
  ProcessValuationRE?: ProcessValuationRE;
  ListWorkfieldImage?: adm_Attachment[];
  InfactLandAreaPrivate?: string;
  LaneWidthMin?: string;
  LaneWidthMax?: string;
  DistanceToMainStreet?: string;
  RefCode?: string;
  IsHasSoDoQuyHoach?: boolean;
  IsHasSoDoVeTinh?: boolean;
  AttachmentSoDoQuyHoach?: adm_Attachment;
  AttachmentSoDoVeTinh?: adm_Attachment;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class BatchREImagesScr extends Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showCustomerInfo: true,
      ProcessValuation: new ProcessValuation(),
      ProcessValuationDocument: new ProcessValuationDocument(),
      ProcessValuationRE: new ProcessValuationRE(),
      ListWorkfieldImage: [],
      IsHasSoDoVeTinh: false,
      IsHasSoDoQuyHoach: false,
      RefCode: "",
      InfactLandAreaPrivate: "",
      LaneWidthMin: "",
      LaneWidthMax: "",
      DistanceToMainStreet: "",
    };
  }

  async componentDidMount() {
    await this.LoadData();
  }

  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new BatchREDto();

      req.MortgageAssetID = this.props.route.params.MortgageAssetID;

      let res = await HttpUtils.post<BatchREDto>(
        ApiUrl.BatchRE_Execute,
        SMX.ApiActionCode.GetProcessValuationREByMA,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationRE: res!.ProcessValuationRE!,
        });
      }

      var reqAttach = new AttachmentDto();
      reqAttach.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      reqAttach.MortgageAssetID = this.props.route.params.MortgageAssetID;
      let resAttach = await HttpUtils.post<AttachmentDto>(
        ApiUrl.Attachment_Execute,
        SMX.ApiActionCode.LoadData,
        JSON.stringify(reqAttach)
      );
      if (res) {
        this.setState({
          ListWorkfieldImage: resAttach!.ListWorkfieldImage!,
          IsHasSoDoQuyHoach: resAttach.IsHasSoDoQuyHoach,
          IsHasSoDoVeTinh: resAttach.IsHasSoDoVeTinh,
          AttachmentSoDoVeTinh: resAttach.AttachmentSoDoVeTinh,
          AttachmentSoDoQuyHoach: resAttach.AttachmentSoDoQuyHoach,
        });
        
        this.state.ListWorkfieldImage.forEach((element) => {
          element.RefID = this.props.route.params.MortgageAssetID;
          element.RefType = 1;
        });
        

        this.props.GlobalStore.HideLoading();
      }
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_Done() {
    try {
      this.props.GlobalStore.ShowLoading();
      let req = new BatchREDto();
      let item = this.state.ProcessValuationRE;
      let pvRE = new ProcessValuationRE();
      pvRE.ProcessValuationREID = item.ProcessValuationREID;
      pvRE.IsWorkfield = true;

      let res = await HttpUtils.post<BatchREDto>(
        ApiUrl.BatchRE_Execute,
        SMX.ApiActionCode.SaveDataRE,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationRE: res!.ProcessValuationRE!,
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
      let req = new BatchREDto();
      let item = this.state.ProcessValuationRE;
      let pvRE = new ProcessValuationRE();

      if (
        this.state.InfactLandAreaPrivate ||
        this.state.InfactLandAreaPrivate == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Diện tích thực tế(m2)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (item.FrontageType == undefined) {
        this.props.GlobalStore.HideLoading();
        let message = "[Mặt tiền tiếp giáp] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (item.ContiguousStreetType == undefined) {
        this.props.GlobalStore.HideLoading();
        let message = "[Loại đường tiếp giáp] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        item.FrontageType === Enums.ProcessValuationREFrontageType.MatDuongPho
      ) {
        if (this.state.LaneWidthMin || this.state.LaneWidthMin == "") {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Độ rộng mặt ngõ/hẻm/đường nội bộ nhỏ nhất (m)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (this.state.LaneWidthMax || this.state.LaneWidthMax == "") {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Độ rộng mặt ngõ/hẻm/đường nội bộ lớn nhất (m)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (
          this.state.DistanceToMainStreet ||
          this.state.DistanceToMainStreet == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Khoảng cách đến mặt đường chính (m)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }

      var infactArea = this.state.InfactLandAreaPrivate;
      var laneWidthMin = this.state.LaneWidthMin;
      var laneWidthMax = this.state.LaneWidthMax;
      var distanceToMainStreet = this.state.DistanceToMainStreet;

      pvRE.ProcessValuationREID = item.ProcessValuationREID;
      pvRE.Version = item.Version;
      pvRE.InfactLandAreaPrivate =
        infactArea && infactArea.length != 0
          ? parseFloat(infactArea.split(",").join("."))
          : undefined;
      pvRE.FrontageType = item.FrontageType;
      pvRE.ContiguousStreetType = item.ContiguousStreetType;
      pvRE.OnLandDescription = item.OnLandDescription;

      if (
        item.FrontageType === Enums.ProcessValuationREFrontageType.MatDuongPho
      ) {
        pvRE.LaneWidthMin =
          laneWidthMin && laneWidthMin.length != 0
            ? parseFloat(laneWidthMin.split(",").join("."))
            : undefined;
        pvRE.LaneWidthMax =
          laneWidthMax && laneWidthMax.length != 0
            ? parseFloat(laneWidthMax.split(",").join("."))
            : undefined;
        pvRE.DistanceToMainStreet =
          distanceToMainStreet && distanceToMainStreet.length != 0
            ? parseFloat(distanceToMainStreet.split(",").join("."))
            : undefined;
      }

      let res = await HttpUtils.post<BatchREDto>(
        ApiUrl.BatchRE_Execute,
        SMX.ApiActionCode.SaveDataRE,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationRE: res!.ProcessValuationRE!,
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
        allowsEditing: true,
      });
      this._handleImagePicked(result);
    } catch (ex) {}
  };

  _handleImagePicked = async (result) => {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new AttachmentDto();
      var att = new adm_Attachment();

      if (this.props.route.params.MortgageAssetID == undefined || this.props.route.params.MortgageAssetID == null) {
        this.props.GlobalStore.HideLoading();
        let message = "Bạn cần thực hiện lưu thông tin trước khi Tải ảnh.";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      att.RefID = this.props.route.params.MortgageAssetID;
      att.ImageBase64String = result.base64;
      att.FileContent = result.base64;
      att.RefCode = "HinhAnh_Khac";
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

  render() {
    let pvRE = this.state.ProcessValuationRE;
    return (
      <View style={{ height: height, backgroundColor: "#F2F2F2" }}>
        <Toolbar Title="Hình ảnh khảo sát" navigation={this.props.navigation} />
        <KeyboardAvoidingView
          behavior="height"
          style={{ flex: 1, paddingHorizontal: 8 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
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
                  colors={SMX.BtnColor}
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
                    style={{
                      fontWeight: "600",
                      color: "#FFFFFF",
                      fontSize: 15,
                      marginLeft: 8,
                    }}
                  >
                    Khảo sát TS
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => {
                  this.props.navigation.navigate("DanhSachTSKhaoSat");
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
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text style={{ fontWeight: "600" }}>
                      STT: {this.props.route.params.STT}
                    </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={{ fontWeight: "600" }}>
                      Số GCN: {this.props.route.params.CertNo}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F0F0F4",
                    marginVertical: 8,
                  }}
                />
                <View style={styles.Item}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Diện tích thực tế(m2) </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      keyboardType={"numeric"}
                      multiline={false}
                      maxLength={15}
                      style={[Theme.TextView]}
                      value={this.state.InfactLandAreaPrivate}
                      onChangeText={(val) => {
                        this.setState({ InfactLandAreaPrivate: val });
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
                />
                <View style={styles.Item}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Mặt tiền tiếp giáp </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <DropDownBox
                      TextField="Value"
                      ValueField="Key"
                      DataSource={
                        SMX.ProcessValuationREFrontageType
                          .dicProcessValuationREFrontageType
                      }
                      SelectedValue={pvRE.FrontageType}
                      OnSelectedItemChanged={(val) => {
                        pvRE.FrontageType = val.Key;
                        this.setState({ ProcessValuationRE: pvRE });
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
                />

                {pvRE.FrontageType ===
                Enums.ProcessValuationREFrontageType.MatDuongPho ? undefined : (
                  <View>
                    <View style={styles.Item}>
                      <View
                        style={{
                          flex: 2,
                          marginBottom: 3,
                          flexDirection: "row",
                        }}
                      >
                        <Text>
                          Độ rộng mặt ngõ/hẻm/đường nội bộ nhỏ nhất (m){" "}
                        </Text>
                        <Text style={{ color: "red" }}>*</Text>
                      </View>
                      <View style={{ flex: 3 }}>
                        <TextInput
                          keyboardType={"numeric"}
                          multiline={false}
                          maxLength={15}
                          style={[Theme.TextView]}
                          value={this.state.LaneWidthMin}
                          onChangeText={(val) => {
                            this.setState({ LaneWidthMin: val });
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
                    />
                    <View style={styles.Item}>
                      <View
                        style={{
                          flex: 2,
                          marginBottom: 3,
                          flexDirection: "row",
                        }}
                      >
                        <Text>
                          Độ rộng mặt ngõ/hẻm/đường nội bộ lớn nhất (m){" "}
                        </Text>
                        <Text style={{ color: "red" }}>*</Text>
                      </View>
                      <View style={{ flex: 3 }}>
                        <TextInput
                          keyboardType={"numeric"}
                          multiline={false}
                          maxLength={15}
                          style={[Theme.TextView]}
                          value={this.state.LaneWidthMax}
                          onChangeText={(val) => {
                            this.setState({ LaneWidthMax: val });
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
                    />
                    <View style={styles.Item}>
                      <View
                        style={{
                          flex: 2,
                          marginBottom: 3,
                          flexDirection: "row",
                        }}
                      >
                        <Text>Khoảng cách đến mặt đường chính (m) </Text>
                        <Text style={{ color: "red" }}>*</Text>
                      </View>
                      <View style={{ flex: 3 }}>
                        <TextInput
                          keyboardType={"numeric"}
                          multiline={false}
                          maxLength={15}
                          style={[Theme.TextView]}
                          value={this.state.DistanceToMainStreet}
                          onChangeText={(val) => {
                            this.setState({ DistanceToMainStreet: val });
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
                    />
                  </View>
                )}

                <View style={styles.Item}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Loại đường tiếp giáp </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <DropDownBox
                      TextField="Value"
                      ValueField="Key"
                      DataSource={SMX.TransformerType.dicTransformerType}
                      SelectedValue={pvRE.ContiguousStreetType}
                      OnSelectedItemChanged={(val) => {
                        pvRE.ContiguousStreetType = val.Key;
                        this.setState({ ProcessValuationRE: pvRE });
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
                />

                <View style={styles.TextAndDrop}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Mô tả tài sản trên đất </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pvRE.OnLandDescription}
                      onChangeText={(val) => {
                        pvRE.OnLandDescription = val;
                        this.setState({ ProcessValuationRE: pvRE });
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
              <Gallery
                navigation={this.props.navigation}
                Images={this.state.ListWorkfieldImage}
                IsHasSoDoQuyHoach={this.state.IsHasSoDoQuyHoach}
                IsHasSoDoVeTinh={this.state.IsHasSoDoVeTinh}
                AttachmentSoDoQuyHoach={this.state.AttachmentSoDoQuyHoach}
                AttachmentSoDoVeTinh={this.state.AttachmentSoDoVeTinh}
                numberColumn={2}
                allowEdit={true}
                allowRemove={true}
              />
            </View>

            <View
              style={{
                marginVertical: 15,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {pvRE.IsWorkfield == true ? (
                <>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                    onPress={() => {
                      this.btn_Done();
                    }}
                  >
                    <LinearGradient
                      colors={SMX.BtnColor}
                      style={{
                        width: width / 4 + 20,
                        height: 40,
                        backgroundColor: "#007AFF",
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesome5 name="save" size={18} color="#FFFFFF" />
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 15,
                          marginLeft: 8,
                        }}
                      >
                        Hoàn thành
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                    onPress={() => {
                      this.btn_Save();
                    }}
                  >
                    <LinearGradient
                      colors={SMX.BtnColor}
                      style={{
                        width: width / 4 - 20,
                        height: 40,
                        backgroundColor: "#007AFF",
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesome5 name="save" size={18} color="#FFFFFF" />
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 15,
                          marginLeft: 8,
                        }}
                      >
                        Lưu
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                    onPress={() => {
                      this._pickImage();
                    }}
                  >
                    <LinearGradient
                      colors={SMX.BtnColor}
                      style={{
                        width: width / 4 + 20,
                        height: 40,
                        backgroundColor: "#007AFF",
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesome5 name="save" size={18} color="#FFFFFF" />
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 15,
                          marginLeft: 8,
                        }}
                      >
                        Thêm ảnh
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : undefined}
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
