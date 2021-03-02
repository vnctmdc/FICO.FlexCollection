import React from 'react';
import { View, TouchableOpacity, FlatList, Text, Dimensions, StyleSheet, TextInput } from "react-native";
import Toolbar from "../../components/Toolbar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import Utility from "../../Utils/Utility";
import Theme from "../../Themes/Default";
import { ClientMessage } from "../../SharedEntity/SMXException";
import PopupModal from "../../components/PopupModal";
import * as Enums from '../../constants/Enums';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ProcessValuationDocument from '../../Entities/ProcessValuationDocument';
import ProcessValuationDocumentDto from '../../DtoParams/ProcessValuationDocumentDto';
import PopupModalUpdateNote from '../../components/PopupModalUpdateNote';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

interface iProps {
    GlobalStore: GlobalStore;
    navigation: any;
}

interface iState {
    PageIndex: number;
    LstPVDocument?: ProcessValuationDocument[];
    showConfirmApprove: boolean;
    showConfirmReject: boolean;
    CommentApprove: string;
    CommentReject: string;
    PVDID?: number;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class DanhsachBCDGChoDuyetSrc extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumAll = false;
    constructor(props: iProps) {
        super(props);
        this.state = {
            PageIndex: 0,
            showConfirmApprove: false,
            showConfirmReject: false,
            CommentApprove: '',
            CommentReject: ''
        };
    }

    async componentDidMount() {
        await this.LoadData(false);
    }

    async SetupForm() {
        try {

        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    async LoadData(isLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDocumentDto();

            req.PageIndex = this.state.PageIndex;

            let res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.GetListValuationApproving,
                JSON.stringify(req)
            );

            if (!isLoadMore) this.setState({ LstPVDocument: res!.LstPVDocument! });
            else this.setState({ LstPVDocument: this.state.LstPVDocument.concat(res!.LstPVDocument!) });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }

    }

    async onApproval() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDocumentDto();

            if (!this.state.CommentApprove || this.state.CommentApprove == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Nội dung] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            req.CommentApprove = this.state.CommentApprove;
            req.PVDID = this.state.PVDID;

            let res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.Approve,
                JSON.stringify(req)
            );

            this.props.GlobalStore.HideLoading();
            let mess = "Phê duyệt thành công!";
                this.props.GlobalStore.Exception = ClientMessage(mess);

        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;

        }
    }

    async onReject() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDocumentDto();

            if (!this.state.CommentReject || this.state.CommentReject == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Nội dung] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            req.CommentReject = this.state.CommentReject;
            req.PVDID = this.state.PVDID;

            let res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.Reject,
                JSON.stringify(req)
            );

            this.setState({});

            this.props.GlobalStore.HideLoading();

        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;

        }
    }

    renderItem(index: number, item: ProcessValuationDocument) {
        return (
            <View
                style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "gainsboro",
                    padding: 10,
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onPress={() => {
                        // this.props.navigation.navigate("CollectionDocumentDisplay", {
                        //     DocumentID: item.DocumentID,
                        //     CustomerID: item.CustomerID,
                        //     DocumentActionID: item.DocumentActionID,
                        // });
                        alert('HIHI');
                    }}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 100,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: '#2e82c4'
                        }}
                    >
                        <Text style={{ fontWeight: "600", fontSize: 17, color: "#000000" }}>
                            {index + 1}
                        </Text>
                    </View>
                    <View style={{ width: width - 95, padding: 10 }}>
                        <Text style={{ width: width - 95, fontWeight: "bold" }}>{item.CustomerName}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Code: </Text>
                            <Text style={{ fontWeight: "600" }}>{item.Code}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Loại TS cấp 1: </Text>
                            <Text style={{ fontWeight: "600" }}>{item.MortgageAssetCode1Name}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Cán bộ định giá: </Text>
                            <Text style={{ fontWeight: "600" }}>{item.ValuationEmployeeName}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Chi nhánh: </Text>
                            <Text style={{ fontWeight: "600" }}>{item.ValuationOrganizationName}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Giá trị định giá(đ): </Text>
                            <Text style={{ fontWeight: "600" }}>{Utility.GetDecimalString(item.TotalValuationAmount)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    <TouchableOpacity
                        style={{ padding: 5 }}
                        onPress={() => {
                            this.setState({ PVDID: item.ProcessValuationDocumentID, showConfirmApprove: true })
                        }}
                        activeOpacity={0.7}
                    >
                        <FontAwesome5 name="check-circle" size={25} color={"#02c39a"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ padding: 5 }}
                        onPress={() => {
                            this.setState({ PVDID: item.ProcessValuationDocumentID, showConfirmReject: true })
                        }}
                        activeOpacity={0.7}
                    >
                        <FontAwesome5 name="times-circle" size={25} color={"#e63946"} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    showConfirmApprove = () => {
        this.setState({ showConfirmApprove: !this.state.showConfirmApprove });
    };

    showConfirmReject = () => {
        this.setState({ showConfirmReject: !this.state.showConfirmReject });
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Danh sách BCĐG chờ duyệt" navigation={this.props.navigation} HasDrawer={true}>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.setState({ PageIndex: 0 }, async () =>
                                    this.LoadData(false))
                            }}
                        >
                            <AntDesign name="reload1" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.props.navigation.navigate('KeHoachVisitNgayMap');
                            }}
                        >
                            <AntDesign name="search1" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>
                <PopupModalUpdateNote
                    resetState={this.showConfirmApprove}
                    modalVisible={this.state.showConfirmApprove}
                    title="Phê duyệt"
                >
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text >Nội dung </Text>
                        <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <View style={{}}>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            style={[Theme.TextInput, { height: 100 }]}
                            value={this.state.CommentApprove}
                            onChangeText={(val) => {
                                this.setState({ CommentApprove: val });
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-end" }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ showConfirmApprove: false }, async () => {
                                    await this.onApproval();
                                });
                            }}
                        >
                            <LinearGradient
                                colors={["#7B35BB", "#5D2E86"]}
                                style={{
                                    //width: 80,
                                    backgroundColor: "#722ED1",
                                    padding: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 5,
                                    alignSelf: "center",
                                    marginRight: 5,
                                }}
                            >
                                <Text style={Theme.BtnTextGradient}>
                                    Phê duyệt
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                //width: 80,
                                backgroundColor: "#E6E9EE",
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                alignSelf: "center",
                                marginLeft: 5,
                            }}
                            onPress={() => {
                                this.setState({ showConfirmApprove: false });
                            }}
                        >
                            <Text style={{ color: "#1B2031", fontSize: 15 }}>
                                Bỏ qua
                            </Text>
                        </TouchableOpacity>
                    </View>
                </PopupModalUpdateNote>
                <PopupModalUpdateNote
                    resetState={this.showConfirmReject}
                    modalVisible={this.state.showConfirmReject}
                    title="Từ chối phê duyệt"
                >
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text >Nội dung </Text>
                        <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <View style={{}}>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            style={[Theme.TextInput, { height: 100 }]}
                            value={this.state.CommentReject}
                            onChangeText={(val) => {
                                this.setState({ CommentReject: val });
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-end" }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ showConfirmReject: false }, async () => {
                                    await this.onApproval();
                                });
                            }}
                        >
                            <LinearGradient
                                colors={["#7B35BB", "#5D2E86"]}
                                style={{
                                    //width: 80,
                                    backgroundColor: "#722ED1",
                                    padding: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 5,
                                    alignSelf: "center",
                                    marginRight: 5,
                                }}
                            >
                                <Text style={Theme.BtnTextGradient}>
                                    Phê duyệt
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                //width: 80,
                                backgroundColor: "#E6E9EE",
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                alignSelf: "center",
                                marginLeft: 5,
                            }}
                            onPress={() => {
                                this.setState({ showConfirmReject: false });
                            }}
                        >
                            <Text style={{ color: "#1B2031", fontSize: 15 }}>
                                Bỏ qua
                            </Text>
                        </TouchableOpacity>
                    </View>
                </PopupModalUpdateNote>

                <FlatList
                    data={this.state.LstPVDocument}
                    //data={this.state.LstAction.filter((x) =>
                    //    Utility.FormatVNLanguage(x.CustomerName!.toLowerCase()).includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //    || x.ListContractCode.toString().toLowerCase().includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //    || x.IDCard!.toLowerCase().includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //    || Utility.FormatVNLanguage(x.DistrictName!.toLowerCase()).includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //    || Utility.FormatVNLanguage(x.ProvinceName!.toLowerCase()).includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //)}
                    renderItem={({ item, index }) => this.renderItem(index, item)}
                    keyExtractor={(item, i) => i.toString()}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentumAll = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentumAll) {
                            if (this.state.LstPVDocument.length >= 20) {
                                this.setState({ PageIndex: this.state.PageIndex + 1 }, async () => {
                                    await this.LoadData(true);
                                });
                                this.onEndReachedCalledDuringMomentumAll = true;
                            }
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
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
