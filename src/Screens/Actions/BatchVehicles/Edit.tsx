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
//Import cho màn lô ptvt
import ProcessValuationVehicle from "../../../Entities/ProcessValuationVehicle";

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
  ProcessValuationVehicle?: ProcessValuationVehicle;
  Type?: string;
  Specification?: string;
  Description?: string;
  ProcessValuationEquipment?: ProcessValuationEquipment;
  FontMoney?: number;
  TransformerType?: number;
  ActualArea?: string;
  WorkfieldDistance?: string;
  UsePurpose?: string;
  Advantage?: string;
  DisAdvantage?: string;
  TypeOfConstruction?: string;
  InformationNote?: string;
  showConfirmAddNew: boolean;
  showConfirmEdit: boolean;
  CheckSaveFalse: boolean;
  ProcessValuationRE?: ProcessValuationRE;
  Show1: boolean;
  ShowDetailVehicles: boolean;
  ShowFontTypeDetail: boolean;
  Views: any;
  // LstBuildingType?: SystemParameter[];
  LstContiguousStreetType?: SystemParameter[];
  LstConstructionType?: SystemParameter[];
  LstCarType?: SystemParameter[];
  LstUsePurpose?: SystemParameter[];
  ListProcessValuationREConstruction?: ProcessValuationREConstruction[];
  ProcessValuationREConstruction?: ProcessValuationREConstruction;
  location?: MarkerObject;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class BatchVehiclesSrc extends Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showCustomerInfo: true,
      ProcessValuation: new ProcessValuation(),
      ProcessValuationDocument: new ProcessValuationDocument(),
      ProcessValuationEquipment: new ProcessValuationEquipment(),
      ProcessValuationREConstruction: new ProcessValuationREConstruction(),
      ProcessValuationVehicle: new ProcessValuationVehicle(),
      WorkfieldDistance: "",
      Type: "",
      UsePurpose: "",
      Specification: "",
      Description: "",
      FontMoney: 1,
      ActualArea: "300.00",
      Advantage: "Những yếu tố thuận lợi *",
      DisAdvantage: "Những yếu tố không thuận lợi *",
      TypeOfConstruction: "",
      InformationNote: "Lưu ý",
      Show1: false,
      ShowFontTypeDetail: true,
      Views: [],
      showConfirmAddNew: false,
      showConfirmEdit: false,
      CheckSaveFalse: false,
      ShowDetailVehicles: false,
      ProcessValuationRE: new ProcessValuationRE(),
      ProcessValuationDocumentID: 1,
    };
  }
  async componentDidMount() {
    await this.LoadData();
    //await this.Check();
    this.getLocationAsync();
  }

  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.BatchVehicles;
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.LoadData,
        JSON.stringify(req)
      );
      if (res) {
        this.setState({
          ProcessValuationDocumentID: res!.ProcessValuationDocumentID,
          ProcessValuationDocument: res!.ProcessValuationDocument,
          ProcessValuation: res!.ProcessValuation,
          ProcessValuationVehicle: res!.ProcessValuationVehicle,
          LstContiguousStreetType: res!.LstContiguousStreetType,
          LstCarType: res!.LstCarType,
          LstUsePurpose: res!.LstUsePurpose,
          WorkfieldDistance: res!.ProcessValuationVehicle.WorkfieldDistance
            ? res!.ProcessValuationVehicle.WorkfieldDistance + ""
            : "",
          UsePurpose: res!.ProcessValuationVehicle.UsePurpose
            ? res!.ProcessValuationVehicle.UsePurpose + ""
            : "",
        });
      }

      let CodeCarType = this.state.LstCarType.filter(
        (x) => x.SystemParameterID == this.state.ProcessValuationVehicle.CarType
      )[0].Code;
      if (CodeCarType == SMX.ProcessValuationVehicle.LoaiXe_ChuyenDung) {
        this.setState({
          ShowDetailVehicles: true,
        });
      } else {
        this.setState({
          ShowDetailVehicles: false,
        });
      }
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
      if (!this.state.WorkfieldDistance || this.state.WorkfieldDistance == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationVehicle.CarType ||
        Utility.GetDecimalString(this.state.ProcessValuationVehicle.CarType) ==
          ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Chi tiết loại phương tiện ] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (!this.state.UsePurpose || this.state.UsePurpose == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Mục đích sử dụng ] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationVehicle.Description ||
        this.state.ProcessValuationVehicle.Description == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Mô tả sơ bộ tài sản ] Không được để trống";
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
      req.MACode2 = SMX.MortgageAssetCode2.BatchVehicles;
      req.SaveType = Enums.SaveType.Completed;
      //var item = this.state.ProcessValuationDocument;
      let pvd = new ProcessValuationDocument();
      let pv = this.state.ProcessValuation;
      let pvRE = this.state.ProcessValuationRE;
      let pvV = this.state.ProcessValuationVehicle;

      // Đổ dữ liệu vào pv
      pv.ProcessValuationID = pvRE.ProcessValuationID;
      pv.CoordinateLat = this.state.location.Latitude.toString();

      pv.CoordinateLon = this.state.location.Longitude.toString();
      pv.Coordinate = `${this.state.location.Latitude.toString()},${this.state.location.Longitude.toString()}`;

      pvd.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      //pvd.Version = pvRE.PVDVersion;
      pvd.Status = Enums.ProcessValuationDocument.KhaoSatHienTrang;

      req.ProcessValuationDocument = pvd;
      req.ProcessValuation = pv;

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.CheckIn,
        JSON.stringify(req)
      );
      this.props.navigation.navigate("REResidentialImagesSrc", {
        ProcessValuationDocumentID: pvV.ProcessValuationDocumentID,
        MortgageAssetID: pvV.MortgageAssetID,
        CustomerName: pvV.CustomerName,
        InfactAddress: pvV.InfactAddress,
      });
      this.props.GlobalStore.HideLoading();
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

  CarTypeDetail(CodeCarTyge) {
    if (CodeCarTyge == SMX.ProcessValuationVehicle.LoaiXe_ChuyenDung) {
      this.setState({
        ShowDetailVehicles: true,
      });
    } else {
      this.setState({
        ShowDetailVehicles: false,
      });
    }
  }
  async btn_Save(saveType: number) {
    try {
      this.props.GlobalStore.ShowLoading();
      let req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.BatchVehicles;
      let pvD = this.state.ProcessValuationDocument;
      let pv = this.state.ProcessValuation;
      let pvV = this.state.ProcessValuationVehicle;
      //Kiểm tra input khi nhập

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
        if (
          !this.state.ProcessValuationVehicle.CarType ||
          Utility.GetDecimalString(
            this.state.ProcessValuationVehicle.CarType
          ) == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Chi tiết loại phương tiện ] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (!this.state.UsePurpose || this.state.UsePurpose == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Mục đích sử dụng ] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (
          !this.state.ProcessValuationVehicle.Description ||
          this.state.ProcessValuationVehicle.Description == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Mô tả sơ bộ tài sản ] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }
      let numWorkfieldDistance = this.state.WorkfieldDistance;
      let stringUsePurpose = this.state.UsePurpose;
      //Đổ dữ liệu vào pvV

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
      pv.UsePurpose = Utility.ConvertToInt(stringUsePurpose);
      // Đổ dữ liệu vào request
      req.ProcessValuationDocument = pvD;
      req.ProcessValuation = pv;
      req.ProcessValuationVehicle = pvV;
      req.SaveType = saveType;

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );

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
    let pvD = this.state.ProcessValuationDocument;
    let pv = this.state.ProcessValuation;
    let pvV = this.state.ProcessValuationVehicle;
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
                flex: 3,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginRight: 15,
                  paddingLeft: 110,
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
                    width: width / 3 - 20,
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
                    pvV.ProcessValuationDocumentID,
                    pvV.MortgageAssetID,
                    pvV.CustomerName,
                    pvV.InfactAddress
                  );
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
            </View>
            <View style={Theme.ViewContent}>
              <View style={styles.Item}>
                <View style={{ flex: 5, flexDirection: "row" }}>
                  <Text style={{ flex: 2 }}>Tên KH: </Text>
                  <Text style={{ flex: 3, fontWeight: "600" }}>
                    {pvV.CustomerName}
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
                    {pvV.InfactAddress}
                  </Text>
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
              <View style={Theme.ViewContent}>
                <View style={styles.ItemKS}>
                  <View style={{ flex: 1 }}>
                    <Text>
                      Khoảng cách đi thẩm định (km){" "}
                      <Text style={{ color: "red" }}>*</Text>{" "}
                    </Text>
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
                <View style={styles.ItemKS}>
                  <View
                    style={{ flex: 1, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>
                      Chi tiết loại phương tiện (m2){" "}
                      <Text style={{ color: "red" }}>*</Text>
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <DropDownBox
                      TextField="Name"
                      ValueField="SystemParameterID"
                      DataSource={this.state.LstCarType}
                      SelectedValue={pvV.CarType}
                      OnSelectedItemChanged={(val) => {
                        pvV.CarType = val.SystemParameterID;
                        this.setState({ ProcessValuationVehicle: pvV });
                        this.CarTypeDetail(val.Code);
                      }}
                    ></DropDownBox>
                  </View>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F0F0F4",
                    marginVertical: 8,
                  }}
                ></View>
                <View
                  style={{
                    display: this.state.ShowDetailVehicles ? "flex" : "none",
                  }}
                >
                  <View style={styles.ItemKS}>
                    <View
                      style={{ flex: 1, marginBottom: 3, flexDirection: "row" }}
                    >
                      <Text>Chi tiết loại xe chuyên dùng </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        numberOfLines={4}
                        multiline={true}
                        textAlignVertical="top"
                        style={[Theme.TextView, { height: 75 }]}
                        value={pvV.CarTypeName}
                        onChangeText={(val) => {
                          pvV.CarTypeName = val;
                          this.setState({ ProcessValuationVehicle: pvV });
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F0F0F4",
                    marginVertical: 8,
                  }}
                ></View>
                <View style={styles.ItemKS}>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text>
                      Mục đích sử dụng <Text style={{ color: "red" }}>*</Text>{" "}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <DropDownBox
                      TextField="Name"
                      ValueField="SystemParameterID"
                      DataSource={this.state.LstUsePurpose}
                      SelectedValue={Utility.ConvertToInt(
                        this.state.UsePurpose
                      )}
                      OnSelectedItemChanged={(val) => {
                        this.setState({ UsePurpose: val.SystemParameterID });
                      }}
                    ></DropDownBox>
                  </View>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F0F0F4",
                    marginVertical: 8,
                  }}
                ></View>
                <View style={styles.ItemKS}>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text>
                      Mô tả sơ bộ tài sản{" "}
                      <Text style={{ color: "red" }}>*</Text>
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pvV.Description}
                      onChangeText={(val) => {
                        pvV.Description = val;
                        this.setState({ ProcessValuationVehicle: pvV });
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                marginVertical: 15,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {pvV.PVDStatus == Enums.ProcessValuationDocument.KiemTraHoSo ? (
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
                  <FontAwesome5 name="save" size={18} color="#FFFFFF" />
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
