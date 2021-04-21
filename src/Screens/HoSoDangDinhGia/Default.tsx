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
import ProcessValuationDocument from '../../Entities/ProcessValuationDocument';
import ProcessValuationDocumentDto, { ProcessValuationDocumentFilter } from '../../DtoParams/ProcessValuationDocumentDto';

const { width, height } = Dimensions.get("window");

interface iProps {
    GlobalStore: GlobalStore;
    navigation: any;
}

interface iState {
    PageIndex: number;
    LstPVDocument?: ProcessValuationDocument[];
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class DSHoSoDangDinhGiaSrc extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumAll = false;
    constructor(props: iProps) {
        super(props);
        this.state = {
            PageIndex: 0,
        };
    }

    async componentDidMount() {
        await this.LoadData(false);

        this.props.GlobalStore.HoSoDangDinhGiaFilterTrigger = () => {
            this.LoadData(false);
        };

    }

    async LoadData(isLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDocumentDto();
            req.PageIndex = this.state.PageIndex;

            let pvdFilter = new ProcessValuationDocumentFilter();
            pvdFilter.CustomerName = '';
            pvdFilter.Province = null;
            pvdFilter.District = null;
            pvdFilter.Town = null;

            if (this.props.GlobalStore.DSFilterValue != undefined) {
                req.Filter = this.props.GlobalStore.DSFilterValue;
            } else {
                req.Filter = pvdFilter;
            }

            let res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.GetListValuation,
                JSON.stringify(req)
            );

            if (!isLoadMore) this.setState({ LstPVDocument: res!.LstPVDocument! });
            else this.setState({ LstPVDocument: this.state.LstPVDocument.concat(res!.LstPVDocument!) });

            this.props.GlobalStore.DSFilterValue = undefined;
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
                    borderBottomWidth: 1,
                    borderBottomColor: "gainsboro",
                    paddingHorizontal: 8,
                    paddingVertical: 3

                }}
            >
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>STT </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{index + 1}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Số BCĐG </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.Code}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Loại TS cấp 1 </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.MortgageAssetCode1Name}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Cán bộ định giá </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.ValuationEmployeeName}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Chi nhánh </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.ValuationOrganizationName}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Tên khách hàng </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.CustomerName}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>TG còn lại của SLA </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.SLAPlanEnd}</Text>
                    </View>
                </View>
            </View>
        );
    }

    renderItem1(index: number, item: ProcessValuationDocument) {
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
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 100,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: '#F1E0FF'
                        }}
                    >
                        <Text style={{ fontWeight: "600", fontSize: 17, color: "#000000" }}>
                            {index + 1}
                        </Text>
                    </View>
                    <View style={{ width: width - 60, padding: 10 }}>
                        <Text style={{ width: width - 95, fontWeight: "bold", color: '#3388cc' }}>{item.Code}</Text>
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
                            <Text>Thời gian còn lại của SLA: </Text>
                            <Text style={{ fontWeight: "600", width: width - 95 }}>{item.SLAPlanEnd}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="DS hồ sơ đang định giá" navigation={this.props.navigation} HasDrawer={true}>
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
                                this.props.navigation.navigate("HoSoFilter", {
                                    Screen: Enums.FeatureId.HoSoDangDinhGia,
                                });
                            }}
                        >
                            <AntDesign name="search1" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>

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
    TextAndDrop: {
        marginTop: 10,
    },
});
