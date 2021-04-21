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
import * as Enums from "../../../constants/Enums";
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
import QuickValuationVehicle from "../../../Entities/QuickValuationVehicle";
import Utility from "../../../Utils/Utility";
import ProcessValuationDto from "../../../DtoParams/ProcessValuationDto";
import ProcessValuation from "../../../Entities/ProcessValuation";
import ProcessValuationDocument from "../../../Entities/ProcessValuationDocument";
import MarkerObject from "../../../SharedEntity/MarkerObject";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import ProcessValuationEquipment from "../../../Entities/ProcessValuationEquipment";
import BatchEquipmentDto from "../../../DtoParams/BatchEquipmentDto";
import MortgageAssetProductionLineDetail from "../../../Entities/MortgageAssetProductionLineDetail";
import AttachmentDto from "../../../DtoParams/AttachmentDto";
import adm_Attachment from "../../../Entities/adm_Attachment";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

interface iProps {
  navigation: any;
  route: any;
  GlobalStore: GlobalStore;
}
interface iState {
  ProcessValuationDocumentID?: number;
  showCustomerInfo: boolean;
  ProcessValuation?: ProcessValuation;
  ProcessValuationDocument?: ProcessValuationDocument;
  ProcessValuationEquipment?: ProcessValuationEquipment;
  WorkfieldDistance?: string;
  location?: MarkerObject;
  ListMortgageAssetProductionLineDetail?: MortgageAssetProductionLineDetail[];
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class BatchEquipmentScr extends Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showCustomerInfo: true,
      ProcessValuation: new ProcessValuation(),
      ProcessValuationDocument: new ProcessValuationDocument(),
      ProcessValuationEquipment: new ProcessValuationEquipment(),
      WorkfieldDistance: "",
      ListMortgageAssetProductionLineDetail: [],
    };
  }

  async componentDidMount() {
    await this.LoadData();
  }

  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new BatchEquipmentDto();
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

      let res = await HttpUtils.post<BatchEquipmentDto>(
        ApiUrl.BatchEquipment_Execute,
        SMX.ApiActionCode.SetupDisplay,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationDocument: res!.ProcessValuationDocument!,
          ProcessValuation: res!.ProcessValuation!,
          ProcessValuationEquipment: res!.ProcessValuationEquipment!,
          ListMortgageAssetProductionLineDetail: res!.ProcessValuation!
            .ListMortgageAssetProductionLineDetail!,
          WorkfieldDistance: res!.ProcessValuationDocument.WorkfieldDistance
            ? res!.ProcessValuationDocument.WorkfieldDistance + ""
            : "",
        });
      }

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_Save(saveType: number, showSuccess?: boolean) {
    try {
      this.props.GlobalStore.ShowLoading();
      let req = new BatchEquipmentDto();
      var pvdOld = this.state.ProcessValuationDocument;
      var pvOld = this.state.ProcessValuation;

      let pvd = new ProcessValuationDocument();
      let pv = new ProcessValuation();

      if (saveType == Enums.SaveType.Completed) {
        if (
          !this.state.WorkfieldDistance ||
          this.state.WorkfieldDistance == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }

        if (!pvOld.UsePurposeDetail || pvOld.UsePurposeDetail == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Mục đích sử dụng của dây chuyền] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }

      var workfieldDistance = this.state.WorkfieldDistance;

      pvd.ProcessValuationDocumentID = pvdOld.ProcessValuationDocumentID;
      pvd.MortgageAssetID = pvdOld.MortgageAssetID;
      pvd.WorkfieldDistance =
        workfieldDistance && workfieldDistance.length != 0
          ? parseFloat(workfieldDistance.split(",").join("."))
          : undefined;
      pvd.Version = pvdOld.Version;
      pvd.CustomerName = pvdOld.CustomerName;
      pvd.Status = pvdOld.Status;

      pv.ProcessValuationID = pvOld.ProcessValuationID;
      pv.UsePurposeDetail = pvOld.UsePurposeDetail;
      pv.Version = pvOld.Version;
      pv.InfactAddress = pvOld.InfactAddress;

      req.ProcessValuationDocument = pvd;
      req.ProcessValuation = pv;
      req.SaveType = saveType;

      let res = await HttpUtils.post<BatchEquipmentDto>(
        ApiUrl.BatchEquipment_Execute,
        SMX.ApiActionCode.SaveData,
        JSON.stringify(req)
      );

      this.setState({
        ProcessValuationDocument: res!.ProcessValuationDocument!,
        ProcessValuation: res!.ProcessValuation!,
        WorkfieldDistance:
          res!.ProcessValuationDocument!.WorkfieldDistance + "",
      });

      this.props.GlobalStore.HideLoading();
      if (showSuccess == true) {
        let mess = "Lưu thành công!";
        this.props.GlobalStore.Exception = ClientMessage(mess);
      }
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_CheckIn() {
    try {
      this.props.GlobalStore.ShowLoading();
      var pvOld = this.state.ProcessValuation;

      if (!this.state.WorkfieldDistance || this.state.WorkfieldDistance == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      if (!pvOld.UsePurposeDetail || pvOld.UsePurposeDetail == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Mục đích sử dụng của dây chuyền] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      if (!location && !location.coords) {
        this.props.GlobalStore.HideLoading();
        let message =
          "Không lấy được vị trí hiện tại, vui lòng bật Permission để lấy tọa độ";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      await this.btn_Save(Enums.SaveType.Completed);

      var req = new BatchEquipmentDto();
      var item = this.state.ProcessValuationDocument;
      let pvd = new ProcessValuationDocument();
      let pv = new ProcessValuation();

      pvd.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
      pvd.Status = Enums.ProcessValuationDocument.KhaoSatHienTrang;

      pv.ProcessValuationID = this.state.ProcessValuation.ProcessValuationID;
      pv.CoordinateLat = location.coords.latitude.toString();
      pv.CoordinateLon = location.coords.longitude.toString();
      pv.Coordinate = `${location.coords.latitude.toString()},${location.coords.longitude.toString()}`;

      req.ProcessValuationDocument = pvd;
      req.ProcessValuation = pv;

      await HttpUtils.post<BatchEquipmentDto>(
        ApiUrl.BatchEquipment_Execute,
        SMX.ApiActionCode.SavePositionWorkfield,
        JSON.stringify(req)
      );

      this.props.GlobalStore.HideLoading();
      let mess = "Lưu tọa độ thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  _upLoadFile = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      this._handleUploadFilePicked(result);
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
      att.RefID = this.props.route.params.MortgageAssetID;
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

      let mess = "Tải BB KSHT thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
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

  async btn_Done() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new BatchEquipmentDto();
      var item = this.state.ProcessValuationDocument;
      var pvd = new ProcessValuationDocument();

      if (item.MortgageAssetID == undefined || item.MortgageAssetID == null) {
        this.props.GlobalStore.HideLoading();
        let message =
          "Bạn cần thực hiện lưu thông tin tại bước Kiểm tra hồ sơ trước khi Thực hiện khảo sát.";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      pvd.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
      pvd.Status = Enums.ProcessValuationDocument.LapBaoCaoDinhGia;
      pvd.MortgageAssetID = item.MortgageAssetID;

      req.ProcessValuationDocument = pvd;

      await HttpUtils.post<BatchEquipmentDto>(
        ApiUrl.BatchEquipment_Execute,
        SMX.ApiActionCode.Done,
        JSON.stringify(req)
      );

      await this.LoadData();

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  //#region Check Exists PVEBatchEquipment

  async btn_CheckExistsPVEBatchEquipment(
    detailID: number,
    nameEQ: string,
    customerName: string,
    InfactAddress: string
  ) {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new BatchEquipmentDto();
      var maplDetail = new MortgageAssetProductionLineDetail();
      let item = this.state.ProcessValuationDocument;
      maplDetail.MortgageAssetProductionLineDetailID = detailID;

      req.MortgageAssetProductionLineDetail = maplDetail;

      let res = await HttpUtils.post<BatchEquipmentDto>(
        ApiUrl.BatchEquipment_Execute,
        SMX.ApiActionCode.CheckExistsPVEBatchEquipment,
        JSON.stringify(req)
      );
      this.props.navigation.navigate("BatchEquipmentImagesSrc", {
        ProcessValuationDocumentID: this.props.route.params
          .ProcessValuationDocumentID,
        ProcessValuationEquipmentID:
          res.ProcessValuationEquipment.ProcessValuationEquipmentID,
        MortgageAssetProductionLineDetailID: detailID,
        RefType: 15,
        Name: nameEQ,
        CustomerName: customerName,
        InfactAddress: InfactAddress,
      });

      // this.props.navigation.navigate("REResidentialImagesSrc", {
      //   ProcessValuationDocumentID: this.props.route.params
      //     .ProcessValuationDocumentID,
      //   ProcessValuationEquipmentID: detailID,
      //   MortgageAssetID: item.MortgageAssetID,
      //   CustomerName: item.CustomerName,
      //   InfactAddress: this.state.ProcessValuation.InfactAddress,
      // });

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  //#endregion

  render() {
    let pvd = this.state.ProcessValuationDocument;
    let pv = this.state.ProcessValuation;
    let pvE = this.state.ProcessValuationEquipment;
    let lstMADetail = this.state.ListMortgageAssetProductionLineDetail;
    return (
      <View style={{ height: height, backgroundColor: "#F6F6FE" }}>
        <Toolbar
          Title="Khảo sát hiện trạng - Khảo sát TS"
          navigation={this.props.navigation}
        />
        <KeyboardAvoidingView
          behavior="height"
          style={{ flex: 1, paddingHorizontal: 8 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => {
                  this.props.navigation.navigate("KhaoSatHienTrangScr", {
                    ProcessValuationDocumentID: pvd.ProcessValuationDocumentID,
                  });
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
                    style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                  >
                    Hồ sơ TS
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
                    <Text>Tên khách hàng </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={{ fontWeight: "600" }}>
                      {pvd.CustomerName}
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
                    <Text>Địa chỉ thực tế </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={{ fontWeight: "600" }}>
                      {pv.InfactAddress}
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
                  <View style={{ flex: 2, flexDirection: "row" }}>
                    <Text>KC đi thẩm định(km) </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      keyboardType={"numeric"}
                      multiline={false}
                      maxLength={15}
                      style={[Theme.TextView]}
                      value={this.state.WorkfieldDistance}
                      onChangeText={(val) => {
                        this.setState({ WorkfieldDistance: val });
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
                    <Text>Mục đích sử dụng của dây chuyền </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      multiline={false}
                      style={[Theme.TextView]}
                      value={pv.UsePurposeDetail}
                      onChangeText={(val) => {
                        pv.UsePurposeDetail = val;
                        this.setState({ ProcessValuation: pv });
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}
                >
                  II. DANH SÁCH MMTB
                </Text>
              </View>
              <View
                style={[
                  Theme.ViewContent,
                  {
                    paddingHorizontal: lstMADetail ? 0 : 8,
                    paddingVertical: lstMADetail ? 0 : 12,
                  },
                ]}
              >
                <ScrollView
                  style={{
                    height:
                      lstMADetail.length > 0
                        ? lstMADetail.length > 1
                          ? 200
                          : 100
                        : undefined,
                  }}
                >
                  {lstMADetail.map((item, index) => {
                    return (
                      <View key={index.toString()}>
                        {item.IsWorkfield == false ||
                        item.IsWorkfield == undefined ? (
                          <TouchableOpacity
                            style={{
                              width: "100%",
                              marginTop: 0,
                              borderBottomWidth: 1,
                              borderColor: "gainsboro",
                              paddingBottom: 0,
                              backgroundColor: "#FFF",
                            }}
                            onPress={() => {
                              this.btn_CheckExistsPVEBatchEquipment(
                                item.MortgageAssetProductionLineDetailID,
                                item.Name,
                                pvd.CustomerName,
                                pv.InfactAddress
                              );
                            }}
                          >
                            <View style={{ width: width - 95, padding: 10 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Tên máy:{" "}
                                </Text>
                                <Text
                                  style={{
                                    fontWeight: "600",
                                    color: "#005599",
                                  }}
                                >
                                  {item.EquipmentName}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Bộ chứng từ/Tên hệ thống:{" "}
                                </Text>
                                <Text style={{}}>{item.Name}</Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Trạng thái:{" "}
                                </Text>
                                <Text style={{}}>{item.IsWorkfieldName}</Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginVertical: 2,
                                  alignItems: "center",
                                }}
                              >
                                <FontAwesome5
                                  name="camera"
                                  size={20}
                                  color="#AE55E6"
                                />
                                <Text
                                  style={{
                                    marginTop: 2,
                                    fontSize: 15,
                                    fontWeight: "800",
                                    color: "#AE55E6",
                                  }}
                                >
                                  {"  "}Chụp ảnh
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <View
                            style={{
                              width: "100%",
                              marginTop: 0,
                              borderBottomWidth: 1,
                              borderColor: "gainsboro",
                              paddingBottom: 0,
                              backgroundColor: "#FFF",
                            }}
                          >
                            <View style={{ width: width - 95, padding: 10 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Tên máy:{" "}
                                </Text>
                                <Text
                                  style={{
                                    fontWeight: "600",
                                    color: "#005599",
                                  }}
                                >
                                  {item.EquipmentName}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Bộ chứng từ/Tên hệ thống:{" "}
                                </Text>
                                <Text style={{}}>{item.Name}</Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Trạng thái:{" "}
                                </Text>
                                <Text style={{}}>{item.IsWorkfieldName}</Text>
                              </View>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <View
              style={{
                marginVertical: 15,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {pvd.Status == Enums.ProcessValuationDocument.KhaoSatHienTrang ? (
                <>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                    onPress={() => {
                      this._upLoadFile();
                    }}
                  >
                    <LinearGradient
                      colors={SMX.BtnColor}
                      style={{
                        width: width / 4 + 48,
                        height: 40,
                        backgroundColor: "#007AFF",
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesome5
                        name="check-circle"
                        size={18}
                        color="#FFFFFF"
                      />
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 15,
                          marginLeft: 8,
                        }}
                      >
                        Tải lên BB KSHT
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
                </>
              ) : undefined}
              {pvd.Status == Enums.ProcessValuationDocument.KiemTraHoSo ? (
                <>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                    onPress={() => {
                      this.btn_CheckIn();
                    }}
                  >
                    <LinearGradient
                      colors={SMX.BtnColor}
                      style={{
                        width: width / 4 + 8,
                        height: 40,
                        backgroundColor: "#007AFF",
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesome5
                        name="check-circle"
                        size={18}
                        color="#FFFFFF"
                      />
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 15,
                          marginLeft: 8,
                        }}
                      >
                        Check In
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
                      this.btn_Save(Enums.SaveType.Completed);
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
