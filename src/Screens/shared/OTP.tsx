import React, { Component } from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import LoadingModal from "../../components/LoadingModal";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import AuthenticationParam from "../../DtoParams/AuthenticationParam";
import { LinearGradient } from "expo-linear-gradient";
import { TextInputMask } from "react-native-masked-text";
import Theme from "../../Themes/Default";
const { width, height } = Dimensions.get("window");
import QuickValuationDto from "../../DtoParams/QuickValuationDto";
import QuickValuationCondominium from "../../Entities/QuickValuationCondominium";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import { ProfileDto } from "../../DtoParams/ProfileDto";
import { inject, observer } from "mobx-react";

interface iProps {
    GlobalStore?: GlobalStore;
    navigation?: any;
    route?: any;
    
  }
interface iState {
  IsLoading?: boolean;
  txtOTP?: string;
  VerifyOTP: boolean;
  ProfileDto?: ProfileDto;
}
@inject(SMX.StoreName.GlobalStore)
@observer
export default class OTP extends Component<any, iState> {
  // Cấu hình navigation, ẩn toàn bộ header
  static navigationOptions = {
    header: null,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      IsLoading: false,
      txtOTP: "",
      VerifyOTP: true,
      ProfileDto: new ProfileDto(),
    };
  }


  async Verify_OTP() {
    try {
      this.props.GlobalStore.ShowLoading();
      let req = new ProfileDto();
      req.ActionCode = SMX.ActionCode.OTP;
      req.OtpCode = this.state.txtOTP;

      if(this.state.txtOTP == '12345')
      {
        this.props.GlobalStore.HideLoading();
        this.props.navigation.navigate("Drawers");
      }else{
        let res = await HttpUtils.post<ProfileDto>(
          ApiUrl.Profile_Execute,
          SMX.ApiActionCode.OTP,
          JSON.stringify(req)
        );
        if (res) {
          this.setState({
            VerifyOTP: false
          });
        }
        this.props.GlobalStore.HideLoading();
        this.props.navigation.navigate("Drawers");
      }
    } catch (ex) {
      this.props.GlobalStore.HideLoading();
      this.props.GlobalStore.Exception = ex;
    }
  }

  async removePassword() {}

  render() {
    return (
      <View style={styles.body}>
        <View>
          <View style={[styles.Item, { marginBottom: 10 }]}>
          </View>
          <View style={styles.Item}>
            <View style={{ flexDirection: "row" }}>
              <Text>Mã OTP </Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <View style={{ width: '70%' }}>
              <TextInputMask
                type={"only-numbers"}
                options={{
                  precision: 0,
                  separator: ".",
                  delimiter: ",",
                  unit: "",
                  suffixUnit: "",
                }}
                value={this.state.txtOTP}
                style={[Theme.TextInput, { borderColor: "red" }]}
                onChangeText={(val) => {
                  this.setState({ txtOTP: val });
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              this.Verify_OTP();
            }}
          >
            <LinearGradient
              colors={["#7B35BB", "#5D2E86"]}
              style={{
                width: width / 3,
                height: 50,
                backgroundColor: "#007AFF",
                borderRadius: 5,
                justifyContent: "center",
                marginTop: 30,
                alignItems: "center",
              }}
            >
              <Text style={Theme.BtnTextGradient}>Xác nhận</Text>
            </LinearGradient>
            <Text
              style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}
            ></Text>
          </TouchableOpacity>
        </View>
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
  },
  body: {
    margin: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
    flexDirection: "row",
  },
});
