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
import ProcessValuationRE from "../../../Entities/ProcessValuationRE";
import RECondominiumDto from "../../../DtoParams/RECondominiumDto";
import LogManager from "../../../Utils/LogManager";

const { width, height } = Dimensions.get("window");

interface iProps {
  navigation: any;
  route: any;
  GlobalStore: GlobalStore;
}
interface iState {
  ProcessValuationDocumentID?: number;
  ProcessValuation?: ProcessValuation;
  ProcessValuationDocument?: ProcessValuationDocument;
  ProcessValuationRE?: ProcessValuationRE;
  WorkfieldDistance?: string;
  InfactFloorArea?: string;
  location?: MarkerObject;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class RECondominiumScr extends Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      ProcessValuationRE: new ProcessValuationRE(),
      WorkfieldDistance: "",
      InfactFloorArea: "",
    };
  }

  async componentDidMount() {
    await this.LoadData();
  }

  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new RECondominiumDto();

      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

      let res = await HttpUtils.post<RECondominiumDto>(
        ApiUrl.RECondominium_Execute,
        SMX.ApiActionCode.SetupDisplay,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationRE: res!.ProcessValuationRE,
          WorkfieldDistance: res!.ProcessValuationRE.WorkfieldDistance
            ? res!.ProcessValuationRE.WorkfieldDistance + ""
            : "",
          InfactFloorArea: res!.ProcessValuationRE.InfactFloorArea
            ? res!.ProcessValuationRE.InfactFloorArea + ""
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
      let req = new RECondominiumDto();
      req.SaveType = saveType;
      let item = this.state.ProcessValuationRE;
      let pvd = new ProcessValuationDocument();
      let pv = new ProcessValuation();
      let pvRE = new ProcessValuationRE();

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

        if (!this.state.InfactFloorArea || this.state.InfactFloorArea == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Diện tích thực tế (m2)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }

        if (!item.Advantage || item.Advantage == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }

        if (!item.DisAdvantage || item.DisAdvantage == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố không thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }

        if (!item.Description || item.Description == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Mô tả] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }

      var numWorkfieldDistance = this.state.WorkfieldDistance;
      var numInfactFloorArea = this.state.InfactFloorArea;

      pvRE.ProcessValuationREID = item.ProcessValuationREID;
      pvRE.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
      pvRE.CustomerName = item.CustomerName;
      pvRE.InfactAddress = item.InfactAddress;
      pvRE.Version = item.Version;
      pvRE.Description = item.Description;
      pvRE.PVDStatus = item.PVDStatus;
      pvRE.InfactFloorArea =
        numInfactFloorArea && numInfactFloorArea.length != 0
          ? parseFloat(numInfactFloorArea.split(",").join("."))
          : undefined;

      pvd.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
      pvd.WorkfieldDistance =
        numWorkfieldDistance && numWorkfieldDistance.length != 0
          ? parseFloat(numWorkfieldDistance.split(",").join("."))
          : undefined;
      pvd.Version = item.PVDVersion;

      pv.ProcessValuationID = item.ProcessValuationID;
      pv.Version = item.PVVersion;
      pv.Advantage = item.Advantage;
      pv.DisAdvantage = item.DisAdvantage;
      pv.WorkfieldOtherInfomation = item.WorkfieldOtherInfomation;

      req.ProcessValuationRE = pvRE;
      req.ProcessValuationDocument = pvd;
      req.ProcessValuation = pv;

      let res = await HttpUtils.post<RECondominiumDto>(
        ApiUrl.RECondominium_Execute,
        SMX.ApiActionCode.SaveData,
        JSON.stringify(req)
      );

      let processValuationRE = res!.ProcessValuationRE;
      processValuationRE.Advantage = res!.ProcessValuation!.Advantage;
      processValuationRE.DisAdvantage = res!.ProcessValuation!.DisAdvantage;
      processValuationRE.WorkfieldOtherInfomation = res!.ProcessValuation!.WorkfieldOtherInfomation;

      if (res) {
        this.setState({
          ProcessValuationDocument: res!.ProcessValuationDocument,
          ProcessValuation: res!.ProcessValuation,
          WorkfieldDistance: res!.ProcessValuationDocument.WorkfieldDistance
            ? res!.ProcessValuationDocument.WorkfieldDistance + ""
            : "",
          InfactFloorArea: res!.ProcessValuationRE.InfactFloorArea
            ? res!.ProcessValuationRE.InfactFloorArea + ""
            : "",
        });
      }

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
      let pvR = this.state.ProcessValuationRE;

      if (!this.state.WorkfieldDistance || this.state.WorkfieldDistance == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      if (!this.state.InfactFloorArea || this.state.InfactFloorArea == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Diện tích thực tế (m2)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      if (!pvR.Advantage || pvR.Advantage == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Những yếu tố thuận lợi] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      if (!pvR.DisAdvantage || pvR.DisAdvantage == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Những yếu tố không thuận lợi] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      if (!pvR.Description || pvR.Description == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Mô tả] Không được để trống";
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
      let req = new RECondominiumDto();
      var item = this.state.ProcessValuationDocument;
      let pvRE = this.state.ProcessValuationRE;
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

      await HttpUtils.post<RECondominiumDto>(
        ApiUrl.RECondominium_Execute,
        SMX.ApiActionCode.SavePositionWorkfield,
        JSON.stringify(req)
      );

      this.props.navigation.navigate("REResidentialImagesSrc", {
        ProcessValuationDocumentID: pvRE.ProcessValuationDocumentID,
        MortgageAssetID: pvRE.MortgageAssetID,
        CustomerName: pvRE.CustomerName,
        InfactAddress: pvRE.InfactAddress,
      });

      this.props.GlobalStore.HideLoading();
      let mess = "Lưu tọa độ thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  render() {
    let pvRE = this.state.ProcessValuationRE;
    return (
      <View style={{ height: height, backgroundColor: "#FFF" }}>
        <Toolbar
          Title="CC Khảo sát hiện trạng - Khảo sát TS"
          navigation={this.props.navigation}
        />
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
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginRight: 15,
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
                    width: width / 3 - 30,
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
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => {
                  this.props.navigation.navigate("REResidentialImagesSrc", {
                    ProcessValuationDocumentID: pvRE.ProcessValuationDocumentID,
                    MortgageAssetID: pvRE.MortgageAssetID,
                    CustomerName: pvRE.CustomerName,
                    InfactAddress: pvRE.InfactAddress,
                  });
                }}
              >
                <LinearGradient
                  colors={SMX.BtnColor}
                  style={{
                    width: width / 3 - 30,
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
                    Hình ảnh
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
                      {pvRE.CustomerName}
                    </Text>
                  </View>
                </View>
                <View style={styles.Item}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Địa chỉ trên GCN </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={{ fontWeight: "600" }}>
                      {pvRE.InfactAddress}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}
                >
                  II. THÔNG TIN KHẢO SÁT
                </Text>
              </View>
              <View style={Theme.ViewContent}>
                <View style={styles.Item}>
                  <View style={{ flex: 2, flexDirection: "row" }}>
                    <Text>KC đi thẩm định(km) </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      keyboardType={"numeric"}
                      multiline={false}
                      style={[Theme.TextView]}
                      value={this.state.WorkfieldDistance}
                      maxLength={15}
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
                    <Text>Diện tích thực tế (m2) </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      keyboardType={"numeric"}
                      multiline={false}
                      style={[Theme.TextView]}
                      maxLength={15}
                      value={this.state.InfactFloorArea}
                      onChangeText={(val) => {
                        this.setState({ InfactFloorArea: val });
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
                    <Text>Những yếu tố thuận lợi </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pvRE.Advantage}
                      onChangeText={(val) => {
                        pvRE.Advantage = val;
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
                    <Text>Những yếu tố không thuận lợi </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pvRE.DisAdvantage}
                      onChangeText={(val) => {
                        pvRE.DisAdvantage = val;
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
                    <Text>Thông tin lưu ý </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pvRE.WorkfieldOtherInfomation}
                      onChangeText={(val) => {
                        pvRE.WorkfieldOtherInfomation = val;
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
                    <Text>Mô tả </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pvRE.Description}
                      onChangeText={(val) => {
                        pvRE.Description = val;
                        this.setState({ ProcessValuationRE: pvRE });
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
                  this.btn_Save(Enums.SaveType.Completed, true);
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
