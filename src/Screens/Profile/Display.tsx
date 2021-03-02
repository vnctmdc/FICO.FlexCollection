import React from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Toolbar from '../../components/Toolbar';
import Employee from '../../Entities/Employee';
import GlobalStore from '../../Stores/GlobalStore';
import Utility from '../../Utils/Utility';
import HttpUtils from '../../Utils/HttpUtils';
import { ProfileDto } from '../../DtoParams/ProfileDto';
import ApiUrl from '../../constants/ApiUrl';
import SMX from '../../constants/SMX';
import { observer, inject } from 'mobx-react';

const { height, width } = Dimensions.get('window');

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}
interface iState {
    Employee: Employee;

}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ProfilesSrc extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            Employee: new Employee()
        }
    }

    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        this.props.GlobalStore.ShowLoading();
        let res = await HttpUtils.post<ProfileDto>(
            ApiUrl.Profile_Execute,
            SMX.ApiActionCode.GetProfile,
            JSON.stringify(new ProfileDto())
        );

        if (res) {
            this.setState({ Employee: res!.Employee! });
        }

        this.props.GlobalStore.HideLoading();

    }

    render() {
        const { Employee } = this.state;
        return (
            <View style={{ height: height, backgroundColor: "#FFF" }}>
                <Toolbar Title="Thông tin người đăng nhập" navigation={this.props.navigation} />

                <View
                    style={{
                        paddingTop: 15,
                        flex: 1,
                        backgroundColor: "#F6F6FE",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                >
                    <View
                        style={{
                            marginVertical: 10,
                            marginHorizontal: 10,
                            //height: height / 4,
                            borderColor: "#F0F0F4",
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 15,
                            backgroundColor: "#FFFFFF",
                            justifyContent: "center",
                        }}
                    >
                        <View style={{ paddingTop: 8 }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <View>
                                    <Image
                                        style={{
                                            backgroundColor: "gainsboro",
                                            borderRadius: 50,
                                            width: 100,
                                            height: 100,
                                            resizeMode: "contain",
                                        }}
                                        source={require("../../../assets/avatar.png")}
                                    />
                                </View>
                                <View style={{ marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ paddingLeft: 8, fontWeight: "bold", fontSize: 30 }}>
                                        {Employee.Name}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            marginVertical: 10,
                            marginHorizontal: 10,
                            borderColor: "#F0F0F4",
                            borderWidth: 1,
                            borderRadius: 8,
                            backgroundColor: "#FFFFFF",
                        }}
                    >
                        <View
                            style={{
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                                <Text>
                                    Chức danh
                                </Text>
                                <Text style={{ fontWeight: "bold" }}>{Employee.Description}</Text>
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#F0F0F4",
                                    marginVertical: 8,
                                }}
                            ></View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                                <Text>
                                    Ngày sinh
                                </Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(Employee.DOB)}</Text>
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#F0F0F4",
                                    marginVertical: 8,
                                }}
                            ></View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                                <Text>
                                    Số điện thoại
                                </Text>
                                <Text style={{ fontWeight: "bold" }}>{Employee.Mobile}</Text>
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#F0F0F4",
                                    marginVertical: 8,
                                }}
                            ></View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                                <Text>
                                    Email
                                </Text>
                                <Text style={{ fontWeight: "bold" }}>{Employee.Email}</Text>
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#F0F0F4",
                                    marginVertical: 8,
                                }}
                            ></View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                                <Text>
                                    Mô tả
                                </Text>
                                <Text style={{ fontWeight: "bold" }}>{Employee.Notes}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}