import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Button,
    Alert,
    BackHandler,
    Image,
} from "react-native";
import * as Enums from "../../constants/Enums";
import Utility from "../../Utils/Utility";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import { inject, observer } from "mobx-react";


interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}
interface iState {
    // alert
    ShowAlert: boolean;
    AlertTitle: string;
    AlertMessage: string;
    onOKClick: () => void;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class SrcSelfValuationDisplay extends React.Component<
iProps,
iState
> {
    constructor(props: iProps) { 
        super(props);
    }
    async componentDidMount() {
       
    }
    componentWillUnmount()
    {

    }
    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    };
    renderAction()
    {
        // let mortgageAssetCode2 = Utility.GetDictionaryValue(
        //     SMX.MortgageAssetCode2.dicMACode,
        //     this.props.route.params.MACode2
        // );
        // switch(mortgageAssetCode2)
        // {
        //     case Enums.MortgageAssetCode2.BatDongSan_DatO:
        //         return(
                   
        //         );
        //         case Enums.MortgageAssetCode2.PTVT_DuongBo:
        //             return(
        //             );
        // }

    }
}
