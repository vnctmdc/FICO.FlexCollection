import React, { Component } from "react";
import {
    Text,
    View,
    Alert,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Dimensions,
    TextInput,
} from "react-native";
import Theme from "../../Themes/Default";
import ApiUrl from "../../constants/ApiUrl";
import Toolbar from "../../components/Toolbar";
import HttpUtils from "../../Utils/HttpUtils";
import SMX from "../../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../Stores/GlobalStore";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DropDownBox from "../../components/DropDownBox";
import SystemParameter from "../../Entities/SystemParameter";
import { TextInputMask } from "react-native-masked-text";
import { ClientMessage } from "../../SharedEntity/SMXException";
import { LinearGradient } from "expo-linear-gradient";
import Utility from "../../Utils/Utility";
import * as Enums from '../../constants/Enums';
import ProcessValuationDocumentDto from "../../DtoParams/ProcessValuationDocumentDto";
import PreLiminaryQuote from "../../Entities/PreLiminaryQuote";
import ProcessValuationDocument from "../../Entities/ProcessValuationDocument";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    route: any;
}

interface iState {
    LstMortgageAsset1: SystemParameter[];
    LstMortgageAssetLevel: SystemParameter[];
    LstMortgageAssetRank: SystemParameter[];
    LstAbilityToTrade: SystemParameter[];
    PreLiminaryQuote?: PreLiminaryQuote;
    TotalValuationAmount?: string;
    CoefficientAbilityToTrade?: string;
    CoefficientCredit?: string;
    btnPreliminaryOK?: boolean;
    MACode1?: number;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class PreLiminareQuote extends React.Component<iProps, iState> {

    constructor(props: iProps) {
        super(props);
        this.state = {
            LstMortgageAsset1: [],
            LstMortgageAssetLevel: [],
            LstMortgageAssetRank: [],
            LstAbilityToTrade: [],
            PreLiminaryQuote: new PreLiminaryQuote(),
            TotalValuationAmount: '',
            CoefficientAbilityToTrade: '',
            CoefficientCredit: '',
        };
    }

    async componentDidMount() {
        await this.SetupViewForm();
        await this.LoadData();
    }

    async SetupViewForm() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new ProcessValuationDocumentDto();
            let res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.Setup_PreLiminareQuote,
                JSON.stringify(req)
            );

            this.setState({
                LstAbilityToTrade: res!.LstAbilityToTrade!,
                LstMortgageAsset1: res!.LstMortgageAsset1!,
                LstMortgageAssetRank: res!.LstMortgageAssetRank!,
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new ProcessValuationDocumentDto();
            var item = new ProcessValuationDocument();
            item.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

            req.ProcessValuationDocument = item;

            let res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.Load_PreLiminareQuote,
                JSON.stringify(req)
            );

            this.setState({ btnPreliminaryOK: res!.btnPreliminaryOK });

            this.setState({
                LstMortgageAssetLevel: res!.LstMortgageAssetLevel!,
                PreLiminaryQuote: res.PreLiminaryQuote,
                TotalValuationAmount: res!.PreLiminaryQuote!.TotalValuationAmount == undefined ? '' : res!.PreLiminaryQuote!.TotalValuationAmount + '',
                CoefficientAbilityToTrade: res!.PreLiminaryQuote!.CoefficientAbilityToTrade == undefined ? '' : res!.PreLiminaryQuote!.CoefficientAbilityToTrade + '',
                CoefficientCredit: res!.PreLiminaryQuote!.CoefficientCredit == undefined ? '' : res!.PreLiminaryQuote!.CoefficientCredit + '',
            });
            

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async btn_PreliminaryOK() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new ProcessValuationDocumentDto();
            var item = this.state.PreLiminaryQuote;

            var numTotalValuationAmount = this.state.TotalValuationAmount;
            var numCoefficientAbilityToTrade = this.state.CoefficientAbilityToTrade;
            var numCoefficientCredit = this.state.CoefficientCredit;


            item.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
            item.TotalValuationAmount = numTotalValuationAmount && numTotalValuationAmount.length != 0 ? parseInt(numTotalValuationAmount.split(",").join("")) : undefined;
            item.CoefficientAbilityToTrade = numCoefficientAbilityToTrade && numCoefficientAbilityToTrade.length != 0 ? parseFloat(numCoefficientAbilityToTrade.split(",").join(".")) : undefined;
            item.CoefficientCredit = numCoefficientCredit && numCoefficientCredit.length != 0 ? parseFloat(numCoefficientCredit.split(",").join(".")) : undefined;

            req.PreLiminaryQuote = item;

            await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.UpdateData_PreLiminareQuote,
                JSON.stringify(req)
            );

            this.props.GlobalStore.HideLoading();
            let mess = "Gửi báo giá thành công!";
            this.props.GlobalStore.Exception = ClientMessage(mess);

            this.props.navigation.goBack();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    render() {
        let { PreLiminaryQuote } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Báo giá sơ bộ" navigation={this.props.navigation} />
                {
                    this.state.btnPreliminaryOK == true ? (
                        <KeyboardAvoidingView behavior="height" style={{ flex: 1, padding: 10 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Chủ  tài sản </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <TextInput
                                            style={[Theme.TextInput]}
                                            value={PreLiminaryQuote.MortgageAssetOwnerName}
                                            onChangeText={(val) => {
                                                PreLiminaryQuote.MortgageAssetOwnerName = val;
                                                this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Khách hàng vay </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={1}
                                            style={[Theme.TextInput]}
                                            value={PreLiminaryQuote.EmployeeName}
                                            onChangeText={(val) => {
                                                PreLiminaryQuote.EmployeeName = val;
                                                this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Số báo cáo </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={1}
                                            style={[Theme.TextInput]}
                                            value={PreLiminaryQuote.Code}
                                            onChangeText={(val) => {
                                                PreLiminaryQuote.Code = val;
                                                this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text >Loại tài sản </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DropDownBox
                                            TextField="Name"
                                            ValueField="SystemParameterID"
                                            DataSource={this.state.LstMortgageAsset1}
                                            SelectedValue={PreLiminaryQuote.MACode1}
                                            OnSelectedItemChanged={(item) => {
                                                PreLiminaryQuote.MACode1 = item.SystemParameterID;
                                                this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: "row" }}>
                                        <Text>Mô tả tài sản </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        style={[Theme.TextInput, { height: 75 }]}
                                        value={PreLiminaryQuote.MortgageAssetDescription}
                                        onChangeText={(val) => {
                                            PreLiminaryQuote.MortgageAssetDescription = val;
                                            this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                        marginTop: 5
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text >Giá trị tài sản </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <TextInputMask
                                            type={"only-numbers"}
                                            options={{
                                                precision: 0,
                                                separator: ".",
                                                delimiter: ",",
                                                unit: "",
                                                suffixUnit: "",
                                            }}
                                            value={this.state.TotalValuationAmount}
                                            style={[Theme.TextInput]}
                                            onChangeText={(val) => {
                                                this.setState({ TotalValuationAmount: val });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text >Cấp tài sản </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DropDownBox
                                            TextField="Name"
                                            ValueField="SystemParameterID"
                                            DataSource={this.state.LstMortgageAssetLevel}
                                            SelectedValue={PreLiminaryQuote.MortgageAssetLevel3}
                                            OnSelectedItemChanged={(item) => {
                                                PreLiminaryQuote.MortgageAssetLevel3 = item.SystemParameterID;
                                                this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text >Hạng tài sản </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DropDownBox
                                            TextField="Name"
                                            ValueField="SystemParameterID"
                                            DataSource={this.state.LstMortgageAssetRank}
                                            SelectedValue={PreLiminaryQuote.MortgageAssetRank}
                                            OnSelectedItemChanged={(item) => {
                                                PreLiminaryQuote.MortgageAssetRank = item.SystemParameterID;
                                                this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text >Tính thanh khoản </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <DropDownBox
                                            TextField="Name"
                                            ValueField="SystemParameterID"
                                            DataSource={this.state.LstAbilityToTrade}
                                            SelectedValue={PreLiminaryQuote.AbilityToTrade}
                                            OnSelectedItemChanged={(item) => {
                                                PreLiminaryQuote.AbilityToTrade = item.SystemParameterID;
                                                this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text >Hệ số thanh khoản chuẩn(%) </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <TextInput
                                            keyboardType={"numeric"}
                                            multiline={false}
                                            style={[Theme.TextView]}
                                            value={this.state.CoefficientAbilityToTrade}
                                            onChangeText={(val) => {
                                                this.setState({ CoefficientAbilityToTrade: val });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text >Hệ số tín dụng chuẩn </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <TextInput
                                            keyboardType={"numeric"}
                                            multiline={false}
                                            style={[Theme.TextView]}
                                            value={this.state.CoefficientCredit}
                                            onChangeText={(val) => {
                                                this.setState({ CoefficientCredit: val });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: "row" }}>
                                        <Text>Thông tin khác </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        style={[Theme.TextInput, { height: 75 }]}
                                        value={PreLiminaryQuote.WorkfieldOtherInfomation}
                                        onChangeText={(val) => {
                                            PreLiminaryQuote.WorkfieldOtherInfomation = val;
                                            this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                        marginTop: 5
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: "row" }}>
                                        <Text>Nhận xét và kiến nghị </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        style={[Theme.TextInput, { height: 75 }]}
                                        value={PreLiminaryQuote.Recommendation}
                                        onChangeText={(val) => {
                                            PreLiminaryQuote.Recommendation = val;
                                            this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                        marginTop: 5
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <Text>Đang trình phê duyệt </Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={1}
                                            style={[Theme.TextInput]}
                                            value={PreLiminaryQuote.ApprovingEmployee}
                                            onChangeText={(val) => {
                                                PreLiminaryQuote.ApprovingEmployee = val;
                                                this.setState({ PreLiminaryQuote: PreLiminaryQuote });
                                            }}
                                        />
                                    </View>
                                </View>

                                <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.btn_PreliminaryOK();
                                        }}
                                    >
                                        <LinearGradient
                                            colors={["#7B35BB", "#5D2E86"]}
                                            style={{
                                                width: width / 3,
                                                backgroundColor: "#722ED1",
                                                padding: 10,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: 5,
                                                alignSelf: "center",
                                                marginRight: 5,
                                            }}
                                        >
                                            <Text style={Theme.BtnTextGradient}>Gửi báo giá</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            width: width / 4,
                                            backgroundColor: "#E6E9EE",
                                            padding: 10,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: 5,
                                            alignSelf: "center",
                                            marginLeft: 5,
                                        }}
                                        onPress={() => {
                                            this.props.navigation.goBack();
                                        }}
                                    >
                                        <Text style={{ color: "#1B2031", fontSize: 15 }}>Thoát</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 1, padding: 10 }}>
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Chủ  tài sản </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.MortgageAssetOwnerName}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Khách hàng vay </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.EmployeeName}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Số báo cáo </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.Code}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Loại tài sản </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.MACode1Name}</Text>
                                    </View>
                                </View>
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: "row" }}>
                                        <Text>Mô tả tài sản </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        editable={false}
                                        style={[Theme.TextInput, { height: 75 }]}
                                        value={PreLiminaryQuote.MortgageAssetDescription}
                                    />
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                        marginTop: 5
                                    }}
                                />
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                        marginTop: 5
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Giá trị tài sản </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.TotalValuationAmount ? Utility.GetDecimalString(PreLiminaryQuote.TotalValuationAmount) : '0'}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Cấp tài sản </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.MortgageAssetLevel3Name}</Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Hạng tài sản </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.MortgageAssetRankName}</Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Tính thanh khoản </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.AbilityToTradeName}</Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Hệ số thanh khoản chuẩn(%) </Text>
                                        <Text style={{ fontWeight: '600' }}>{Utility.GetDecimalString(PreLiminaryQuote.CoefficientAbilityToTrade)}</Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Hệ số tín dụng chuẩn </Text>
                                        <Text style={{ fontWeight: '600' }}>{Utility.GetDecimalString(PreLiminaryQuote.CoefficientCredit)}</Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                        marginTop: 5
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: "row" }}>
                                        <Text>Thông tin khác </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        editable={false}
                                        style={[Theme.TextInput, { height: 75 }]}
                                        value={PreLiminaryQuote.WorkfieldOtherInfomation}
                                    />
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 8,
                                        marginTop: 5
                                    }}
                                />
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: "row" }}>
                                        <Text>Nhận xét và kiến nghị </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        editable={false}
                                        style={[Theme.TextInput, { height: 75 }]}
                                        value={PreLiminaryQuote.Recommendation}
                                    />
                                </View>
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Đang trình phê duyệt </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.ApprovingEmployee}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Người tạo </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.CreatedBy}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Ngày tạo </Text>
                                        <Text style={{ fontWeight: '600' }}>{PreLiminaryQuote.CreatedDTGText}</Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "#F0F0F4",
                                        marginVertical: 8,
                                    }}
                                />

                                <TouchableOpacity
                                    style={{
                                        width: width / 4,
                                        backgroundColor: "#E6E9EE",
                                        padding: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 5,
                                        alignSelf: "center",
                                        marginLeft: 5,
                                        marginTop: 20,
                                    }}
                                    onPress={() => {
                                        this.props.navigation.goBack();
                                    }}
                                >
                                    <Text style={{ color: "#1B2031", fontSize: 15 }}>Thoát</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    )
                }
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
});


