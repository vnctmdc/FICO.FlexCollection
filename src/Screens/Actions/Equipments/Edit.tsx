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
import DropDownBox from "../../../components/DropDownBox";
import SystemParameter from "../../../Entities/SystemParameter";
import { TextInputMask } from "react-native-masked-text";
import { ClientMessage } from "../../../SharedEntity/SMXException";
import { LinearGradient } from "expo-linear-gradient";
import Utility from "../../../Utils/Utility";
import ProcessValuationDto from "../../../DtoParams/ProcessValuationDto";
import ProcessValuation from "../../../Entities/ProcessValuation";
import ProcessValuationDocument from "../../../Entities/ProcessValuationDocument";
import MarkerObject from "../../../SharedEntity/MarkerObject";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import LogManager from "../../../Utils/LogManager";
import ProcessValuationVessel from "../../../Entities/ProcessValuationVessel";
import VesselDto from "../../../DtoParams/VesselDto";
import ProcessValuationEquipment from "../../../Entities/ProcessValuationEquipment";
import EquipmentDto from "../../../DtoParams/EquipmentDto";

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
  WorkfieldDistance?: string;
  location?: MarkerObject;
  ProcessValuationEquipment?: ProcessValuationEquipment;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class EquipmentScr extends Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      ProcessValuationEquipment: new ProcessValuationEquipment(),
      WorkfieldDistance: "",
    };
  }

  async componentDidMount() {
    await this.LoadData();
  }

  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new EquipmentDto();

      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

      let res = await HttpUtils.post<EquipmentDto>(
        ApiUrl.Equipment_Execute,
        SMX.ApiActionCode.SetupDisplay,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationEquipment: res!.ProcessValuationEquipment,
          WorkfieldDistance: res!.ProcessValuationEquipment.WorkfieldDistance
            ? res!.ProcessValuationEquipment.WorkfieldDistance + ""
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
      let req = new EquipmentDto();
      req.SaveType = saveType;
      let item = this.state.ProcessValuationEquipment;
      let pvd = new ProcessValuationDocument();
      let pv = new ProcessValuation();
      let pvVE = new ProcessValuationEquipment();

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

        if (!item.Type || item.Type == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Tên máy móc thiết bị] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }

        if (!item.Specification || item.Specification == "") {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Chi tiết mục đích, công năng sử dụng] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }

        if (!item.Description || item.Description == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Mô tả sơ bộ tài sản] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }

      var numWorkfieldDistance = this.state.WorkfieldDistance;

      pvVE.ProcessValuationEquipmentID = item.ProcessValuationEquipmentID;
      pvVE.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
      pvVE.Version = item.Version;
      pvVE.Type = item.Type;
      pvVE.CustomerName = item.CustomerName;
      pvVE.InfactAddress = item.InfactAddress;
      pvVE.Specification = item.Specification;
      pvVE.Description = item.Description;

      pvd.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
      pvd.WorkfieldDistance =
        numWorkfieldDistance && numWorkfieldDistance.length != 0
          ? parseFloat(numWorkfieldDistance.split(",").join("."))
          : undefined;
      pvd.Version = item.PVDVersion;

      pv.ProcessValuationID = item.ProcessValuationID;
      pv.Version = item.PVVersion;

      req.ProcessValuationEquipment = pvVE;
      req.ProcessValuationDocument = pvd;
      req.ProcessValuation = pv;

      let res = await HttpUtils.post<EquipmentDto>(
        ApiUrl.Equipment_Execute,
        SMX.ApiActionCode.SaveData,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationDocument: res!.ProcessValuationDocument,
          ProcessValuation: res!.ProcessValuation,
          WorkfieldDistance: res!.ProcessValuationDocument.WorkfieldDistance
            ? res!.ProcessValuationDocument.WorkfieldDistance + ""
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

      let pvE = this.state.ProcessValuationEquipment;

      if (!this.state.WorkfieldDistance || this.state.WorkfieldDistance == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      if (!pvE.Type || pvE.Type == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Tên máy móc thiết bị] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      if (!pvE.Specification || pvE.Specification == "") {
        this.props.GlobalStore.HideLoading();
        let message =
          "[Chi tiết mục đích, công năng sử dụng] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      if (!pvE.Description || pvE.Description == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Mô tả sơ bộ tài sản] Không được để trống";
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

      var req = new EquipmentDto();
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

      await HttpUtils.post<EquipmentDto>(
        ApiUrl.Equipment_Execute,
        SMX.ApiActionCode.SavePositionWorkfield,
        JSON.stringify(req)
      );

      this.props.navigation.navigate("REResidentialImagesSrc", {
        ProcessValuationDocumentID: this.props.route.params
          .ProcessValuationDocumentID,
        MortgageAssetID: item.MortgageAssetID,
        CustomerName: this.state.ProcessValuationEquipment.CustomerName,
        InfactAddress: this.state.ProcessValuationEquipment.InfactAddress,
      });

      this.props.GlobalStore.HideLoading();
      let mess = "Lưu tọa độ thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
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
    let pvVE = this.state.ProcessValuationEquipment;
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
                    ProcessValuationDocumentID: pvVE.ProcessValuationDocumentID,
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
                  this.btn_SaveTemporary(
                    pvVE.ProcessValuationDocumentID,
                    pvVE.MortgageAssetID,
                    pvVE.CustomerName,
                    pvVE.InfactAddress
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
                      {pvVE.CustomerName}
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
                      {pvVE.InfactAddress}
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
                    <Text>Tên máy móc thiết bị </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      multiline={false}
                      style={[Theme.TextView]}
                      value={pvVE.Type}
                      onChangeText={(val) => {
                        pvVE.Type = val;
                        this.setState({ ProcessValuationEquipment: pvVE });
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
                    <Text>Chi tiết mục đích, công năng sử dụng </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pvVE.Specification}
                      onChangeText={(val) => {
                        pvVE.Specification = val;
                        this.setState({ ProcessValuationEquipment: pvVE });
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
                    <Text>Mô tả sơ bộ tài sản </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pvVE.Description}
                      onChangeText={(val) => {
                        pvVE.Description = val;
                        this.setState({ ProcessValuationEquipment: pvVE });
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
              {pvVE.PVDStatus == Enums.ProcessValuationDocument.KiemTraHoSo ? (
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
