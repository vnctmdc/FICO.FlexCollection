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
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
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
import ActionMobileDto from "../../../DtoParams/ActionMobileDto";

import ProcessValuation from "../../../Entities/ProcessValuation";
import ProcessValuationDocument from "../../../Entities/ProcessValuationDocument";
import ProcessValuationEquipment from "../../../Entities/ProcessValuationEquipment";
import ProcessValuationREConstruction from "../../../Entities/ProcessValuationREConstruction";
import PopupModalUpdateNote from "../../../components/PopupModalUpdateNote";
import ProcessValuationRE from "../../../Entities/ProcessValuationRE";
//import Utility from "../../../Utils/Utility";
import MarkerObject from "../../../SharedEntity/MarkerObject";
import * as Location from "expo-location";
import * as Enums from "../../../../src/constants/Enums";
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
  //ProcessValuationDocument?: ProcessValuationDocument;
  ProcessValuationDocument?: ProcessValuationDocument;
  Type?: string;
  Specification?: string;
  Description?: string;
  FontMoney?: number;
  TransformerType?: number;
  ActualArea?: string;
  WorkfieldDistance?: string;
  WorkfieldOtherInfomation?: string;
  Advantage?: string;
  DisAdvantage?: string;
  TypeOfConstruction?: string;
  InformationNote?: string;
  showConfirmAddNew: boolean;
  showConfirmEdit: boolean;
  CheckSaveFalse: boolean;
  ProcessValuationRE?: ProcessValuationRE;
  Show1: boolean;
  ShowFontTypeDetail: boolean;
  Views: any;
  // LstBuildingType?: SystemParameter[];
  LstContiguousStreetType?: SystemParameter[];
  LstConstructionType?: SystemParameter[];
  ListProcessValuationREConstruction?: ProcessValuationREConstruction[];
  ProcessValuationREConstruction?: ProcessValuationREConstruction;
  location?: MarkerObject;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ReProjectsSrc extends Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showCustomerInfo: true,
      ProcessValuation: new ProcessValuation(),
      ProcessValuationDocument: new ProcessValuationDocument(),
      ProcessValuationREConstruction: new ProcessValuationREConstruction(),
      WorkfieldDistance: "",
      Type: "",
      Specification: "",
      Description: "",
      FontMoney: 1,
      ActualArea: "300.00",
      Advantage: "Những yếu tố thuận lợi *",
      DisAdvantage: "Những yếu tố không thuận lợi *",
      WorkfieldOtherInfomation: "",
      TypeOfConstruction: "",
      InformationNote: "Lưu ý",
      Show1: false,
      ShowFontTypeDetail: true,
      Views: [],
      showConfirmAddNew: false,
      showConfirmEdit: false,
      CheckSaveFalse: false,
      ProcessValuationRE: new ProcessValuationRE(),
      ProcessValuationDocumentID: 1,
    };
  }
  async componentDidMount() {
    await this.LoadData();
    await this.SetUpViewForm();
    this.getLocationAsync();
  }

  async SetUpViewForm() {
    try {
      this.props.GlobalStore.ShowLoading();
      if (
        this.state.ProcessValuationRE.FrontageType ==
          Enums.ProcessValuationREFrontageType.MatNgoHem ||
        this.state.ProcessValuationRE.FrontageType ==
          Enums.ProcessValuationREFrontageType.MatDuongNoiBo
      ) {
        this.setState({
          ShowFontTypeDetail: true,
        });
      } else {
        this.setState({
          ShowFontTypeDetail: false,
        });
      }
      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REProjects;
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.LoadData,
        JSON.stringify(req)
      );
      //console.log("Hihi",res);

      if (res) {
        this.setState({
          ProcessValuationRE: res!.ProcessValuationRE,
          ProcessValuationDocumentID: res!.ProcessValuationDocumentID,
          ProcessValuationDocument: res!.ProcessValuationDocument,
          ProcessValuation: res!.ProcessValuation,
          LstContiguousStreetType: res!.LstContiguousStreetType,
          LstConstructionType: res!.LstConstructionType,
          ListProcessValuationREConstruction: res!
            .ListProcessValuationREConstruction,
          WorkfieldDistance: res!.ProcessValuationRE.WorkfieldDistance
            ? res!.ProcessValuationRE.WorkfieldDistance + ""
            : "",
          Advantage: res!.ProcessValuationRE.WorkfieldDistance
            ? res!.ProcessValuationRE.Advantage + ""
            : "",
          DisAdvantage: res!.ProcessValuationRE.WorkfieldDistance
            ? res!.ProcessValuationRE.DisAdvantage + ""
            : "",
          WorkfieldOtherInfomation: res!.ProcessValuationRE
            .WorkfieldOtherInfomation
            ? res!.ProcessValuationRE.WorkfieldOtherInfomation + ""
            : "",
        });
      }
      //console.log("Hihi ProcessValuationRE", this.state.ProcessValuationRE);

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async getLocationAsync() {
    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      location: new MarkerObject(
        1,
        location.coords.latitude,
        location.coords.longitude,
        "Vị trí hiện tại"
      ),
    });
  }

  async btn_CheckIn() {
    try {
      this.props.GlobalStore.ShowLoading();
      if (!this.state.Advantage || this.state.Advantage == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Những yếu tố thuận lợi] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (!this.state.DisAdvantage || this.state.DisAdvantage == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Những yếu tố không thuận lợi] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationRE.OnLandDescription ||
        this.state.ProcessValuationRE.OnLandDescription == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Mô tả chi tiết đất] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (this.state.location == undefined || this.state.location == null) {
        this.props.GlobalStore.HideLoading();
        let message =
          "Không lấy được vị trí hiện tại, vui lòng bật Permission để lấy tọa độ";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      await this.btn_Save(Enums.SaveType.Completed);
      var req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REProjects;
      req.SaveType = Enums.SaveType.Completed;
      //var item = this.state.ProcessValuationDocument;
      let pvd = new ProcessValuationDocument();
      let pv = this.state.ProcessValuation;
      let pvRE = this.state.ProcessValuationRE;

      // Đổ dữ liệu vào pv
      pv.ProcessValuationID = pvRE.ProcessValuationID;
      pv.CoordinateLat = this.state.location.Latitude.toString();
      pv.CoordinateLon = this.state.location.Longitude.toString();
      pv.Coordinate = `${this.state.location.Latitude.toString()},${this.state.location.Longitude.toString()}`;
      // Đổ dữ liệu vào pcd

      pvd.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      //pvd.Version = pvRE.PVDVersion;
      pvd.Status = Enums.ProcessValuationDocument.KhaoSatHienTrang;
      req.ProcessValuationDocument = pvd;
      req.ProcessValuation = pv;
      //console.log("SAD",req);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.CheckIn,
        JSON.stringify(req)
      );

      this.props.GlobalStore.HideLoading();
      let mess = "Lưu thông tin thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
      this.props.navigation.navigate("REResidentialImagesSrc", {
        ProcessValuationDocumentID: pvRE.ProcessValuationDocumentID,
        MortgageAssetID: pvRE.MortgageAssetID,
        CustomerName: pvRE.CustomerName,
        InfactAddress: pvRE.InfactAddress,
      });
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  showConfirmAddNew = () => {
    this.setState({ showConfirmAddNew: !this.state.showConfirmAddNew });
  };
  showConfirmEdit = () => {
    this.setState({ showConfirmEdit: !this.state.showConfirmEdit });
  };

  frontageTypeDetail(idFrontage) {
    if (
      idFrontage == Enums.ProcessValuationREFrontageType.MatNgoHem ||
      idFrontage == Enums.ProcessValuationREFrontageType.MatDuongNoiBo
    ) {
      this.setState({
        ShowFontTypeDetail: true,
      });
    } else {
      this.setState({
        ShowFontTypeDetail: false,
      });
    }
  }
  async btn_Save(saveType: number) {
    try {
      this.props.GlobalStore.ShowLoading();
      let req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REProjects;
      // console.log(123,this.state.ProcessValuationDocument);
      // console.log(456,this.state.ProcessValuationRE);
      // console.log(789, this.state.ProcessValuation);
      let pvD = this.state.ProcessValuationDocument;
      let pvRE = this.state.ProcessValuationRE;
      let pv = this.state.ProcessValuation;
      //Kiểm tra input khi nhập

      if (saveType == Enums.SaveType.Completed) {
        if (!this.state.Advantage || this.state.Advantage == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (!this.state.DisAdvantage || this.state.DisAdvantage == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố không thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (
          !this.state.ProcessValuationRE.OnLandDescription ||
          this.state.ProcessValuationRE.OnLandDescription == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Mô tả chi tiết đất] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }
      let stringAdvantage = this.state.Advantage;
      let stringDisAdvantage = this.state.DisAdvantage;
      let numWorkfieldDistance = this.state.WorkfieldDistance;
      let stringWorkfieldOtherInfomation = this.state.WorkfieldOtherInfomation;
      // Đổ dữ liệu vào pvRE
      pvRE.ProcessValuationREID = this.state.ProcessValuationRE.ProcessValuationREID;
      pvRE.ProcessValuationDocumentID = this.state.ProcessValuationRE.ProcessValuationDocumentID;
      pvRE.Version = this.state.ProcessValuationRE.Version;
      pvRE.OnLandDescription = this.state.ProcessValuationRE.OnLandDescription;
      pvRE.Description = this.state.ProcessValuationRE.Description;

      // Đổ dữ liệu vào pvD
      pvD.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      pvD.Version = this.state.ProcessValuationRE.PVDVersion;
      pvD.WorkfieldDistance =
        numWorkfieldDistance && numWorkfieldDistance.length != 0
          ? parseFloat(numWorkfieldDistance.split(",").join("."))
          : undefined;

      // Đổ dữ liệu vào pv
      pv.ProcessValuationID = this.state.ProcessValuationRE.ProcessValuationID;
      pv.Version = this.state.ProcessValuationRE.PVVersion;
      pv.Advantage = stringAdvantage;
      pv.DisAdvantage = stringDisAdvantage;
      pv.WorkfieldOtherInfomation = stringWorkfieldOtherInfomation;

      // Đổ dữ liệu vào request
      req.ProcessValuationDocument = pvD;
      req.ProcessValuation = pv;
      req.ProcessValuationRE = pvRE;
      req.SaveType = saveType;
      //console.log("Hihi",req);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );
      //ProcessValuationDocument: res!.ProcessValuationDocument,
      if (res) {
        this.setState({});
      }
      this.props.GlobalStore.HideLoading();
      if (saveType == Enums.SaveType.Completed) {
        let mess = "Lưu thông tin thành công!";
        this.props.GlobalStore.Exception = ClientMessage(mess);
      }
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_SaveTemporary(
    pvdID: number,
    maID: number,
    customerName: string,
    address: string
  ) {
    await this.btn_Save(Enums.SaveType.Temporary);
    this.props.navigation.navigate("REResidentialImagesSrc", {
      ProcessValuationDocumentID: pvdID,
      MortgageAssetID: maID,
      CustomerName: customerName,
      InfactAddress: address,
    });
  }

  render() {
    let pvRE = this.state.ProcessValuationRE;
    return (
      <View style={{ height: height, backgroundColor: "#FFF" }}>
        <Toolbar
          Title="Khảo sát hiện trạng - Khảo sát TS"
          navigation={this.props.navigation}
        />
        <KeyboardAvoidingView
          behavior="height"
          style={{ flex: 1, paddingHorizontal: 8 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 2,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "flex-end",
                paddingLeft: 60,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginRight: 15,
                  paddingLeft: 60,
                }}
                onPress={() => {
                  this.props.navigation.navigate("KhaoSatHienTrangScr", {
                    ProcessValuationDocumentID: pvRE.ProcessValuationDocumentID,
                  });
                }}
              >
                <LinearGradient
                  colors={SMX.BtnColor}
                  style={{
                    width: width / 3 - 10,
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

              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  paddingLeft: 7,
                }}
                onPress={() => {
                  this.btn_SaveTemporary(
                    pvRE.ProcessValuationDocumentID,
                    pvRE.MortgageAssetID,
                    pvRE.CustomerName,
                    pvRE.InfactAddress
                  );
                }}
              >
                <LinearGradient
                  colors={SMX.BtnColor}
                  style={{
                    width: width / 3 - 10,
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
                    Hình ảnh TS
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFFFF" }}
                >
                  I. THÔNG TIN KHÁCH HÀNG
                </Text>
              </View>
              <View style={Theme.ViewContent}>
                <View>
                  <View style={{ backgroundColor: "FFFFFF" }}>
                    <View style={styles.Item}>
                      <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ flex: 2 }}>Tên KH: </Text>
                        <Text style={{ flex: 3, fontWeight: "600" }}>
                          {pvRE.CustomerName}
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
                      <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ flex: 2 }}>Địa chỉ trên GCN: </Text>
                        <Text style={{ flex: 3, fontWeight: "600" }}>
                          {pvRE.InfactAddress}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFFFF" }}
                >
                  II. THÔNG TIN KHẢO SÁT
                </Text>
              </View>
            </View>
            <View style={Theme.ViewContent}>
              <View style={styles.ItemKS}>
                <View style={{ flex: 1 }}>
                  <Text>Khoảng cách đi thẩm định (km) </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    keyboardType={"numeric"}
                    multiline={false}
                    maxLength={15}
                    value={this.state.WorkfieldDistance}
                    style={[Theme.TextInput]}
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
              ></View>
              <View style={styles.TextAndDrop}>
                <View style={{ marginBottom: 3, flexDirection: "row" }}>
                  <Text>
                    Những yếu tố thuận lợi{" "}
                    <Text style={{ color: "red" }}>*</Text>
                  </Text>
                </View>
                <View>
                  <TextInput
                    numberOfLines={4}
                    multiline={true}
                    textAlignVertical="top"
                    style={[Theme.TextView, { height: 75 }]}
                    value={this.state.Advantage}
                    onChangeText={(val) => {
                      this.setState({ Advantage: val });
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
              <View style={styles.TextAndDrop}>
                <View style={{ marginBottom: 3, flexDirection: "row" }}>
                  <Text>Những yếu tố không thuận lợi </Text>
                  <Text style={{ color: "red" }}>*</Text>
                </View>
                <View>
                  <TextInput
                    multiline={false}
                    style={[Theme.TextView, {}]}
                    value={this.state.DisAdvantage}
                    onChangeText={(val) => {
                      this.setState({ DisAdvantage: val });
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
              <View style={styles.TextAndDrop}>
                <View style={{ flexDirection: "row" }}>
                  <Text>Mô tả chi tiết đất </Text>
                  <Text style={{ color: "red" }}>*</Text>
                </View>
                <View>
                  <TextInput
                    multiline={false}
                    style={[Theme.TextView, {}]}
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
              ></View>
              <View style={styles.TextAndDrop}>
                <View style={{ flexDirection: "row" }}>
                  <Text>Mô tả chi tiết công trình xây dựng </Text>
                  {/* <Text style={{ color: 'red' }}>*</Text> */}
                </View>
                <View>
                  <TextInput
                    multiline={false}
                    style={[Theme.TextView, {}]}
                    value={pvRE.Description}
                    onChangeText={(val) => {
                      pvRE.Description = val;
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
              ></View>
              <View style={styles.TextAndDrop}>
                <View style={{ flexDirection: "row" }}>
                  <Text>Thông tin lưu ý </Text>
                  {/* <Text style={{ color: 'red' }}>*</Text> */}
                </View>
                <View>
                  <TextInput
                    multiline={false}
                    style={[Theme.TextView, {}]}
                    value={this.state.WorkfieldOtherInfomation}
                    onChangeText={(val) => {
                      this.setState({ WorkfieldOtherInfomation: val });
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
            </View>
            <View
              style={{
                marginVertical: 15,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {pvRE.PVDStatus == Enums.ProcessValuationDocument.KiemTraHoSo ? (
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
                      style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                    >
                      Check In
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : undefined}
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
                  <Text
                    style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                  >
                    Lưu
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
  ItemKS: { flex: 2, flexDirection: "row", marginTop: 2 },

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
  ItemDelete: {
    borderWidth: 1,
    borderColor: "#99b4d1",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 7,
    marginTop: 10,
  },
  TinyImage: {
    flex: 1,
    width: 150,
    height: 150,
  },
});
