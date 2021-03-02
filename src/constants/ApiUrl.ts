import EnvConfig from "../Utils/EnvConfig";

class ApiUrl {
    // Service dùng chung mức hệ thống
    static Global_GetVersion_Api = EnvConfig.getApiHost() + "/api/Global/GetAppInfomation";

    // Authentication
    static Authentication_Login = EnvConfig.getApiHost() + "/api/Authentication/Login";
    static Authentication_Logout = EnvConfig.getApiHost() + "/api/Authentication/Logout";

    //StorePriceStandardREResidential
    static StorePriceStandardREResidential_ExecuteStorePriceStandardREResidential =
        EnvConfig.getApiHost() + "/api/StorePriceStandardREResidential/ExecuteStorePriceStandardREResidential";

    // google api
    static GoogleApiKey = "AIzaSyBH9asRxO8HBTrQZfcc5iQHUAaxbCqLl3U";
    static GoogleApiKeyAndroid = "AIzaSyDTGz8M-Sci70UL8RpnUfrWpbbr6rZY_As";
    static GoogleApiKeyIos = "AIzaSyBLceFu9fgncT-AOiopiNDD0IKnFPguCms";
    static GoogleGeocodeApi = "https://maps.googleapis.com/maps/api/geocode/json";
    static GOOGLE_MAPS_APIKEY = "AIzaSyClDucuuamy9Fgz3OtBu9XoECjXH0T4sXM";

    // SystemParameter
    static Global_GetSystemParamNameByID = EnvConfig.getApiHost() + "/api/Global/GetSystemParamNameByID";
    static Global_GetSystemParam = EnvConfig.getApiHost() + "/api/Global/GetSystemParam";
    static Global_GetByFeatureID = EnvConfig.getApiHost() + "/api/Global/GetByFeatureID";
    static Global_GetByFeatureIDAndExt1i = EnvConfig.getApiHost() + "/api/Global/GetByFeatureIDAndExt1i";
    static Global_LogError = EnvConfig.getApiHost() + "/api/Global/LogError";

    static Attachment_ImagePreview = EnvConfig.getApiHost() + "/AttachmentImageViewer.ashx";

    // chart
    static Home_Chart = EnvConfig.getApiHost() + "/Chart/Home.aspx";

    //static PDFViewer = EnvConfig.getApiHost() + "/ProcessValuationDocumentPdfViewer.ashx";

    static PostExpoNotificationToken = EnvConfig.getApiHost() + "/api/devicetoken/ExecuteDeviceToken";

    static Notification_ExecuteNotification = EnvConfig.getApiHost() + "/api/notification/ExecuteNotification";

    static CollectionDocument_Execute = EnvConfig.getApiHost() + "/api/CollectionDocument/Execute";

    static CollectionDebtContract_Execute = EnvConfig.getApiHost() + "/api/CollectionDebtContract/Execute";

    static CollectionDocumentAll_Execute = EnvConfig.getApiHost() + "/api/CollectionDocumentAll/Execute";

    static Profile_Execute = EnvConfig.getApiHost() + "/api/Profiles/Execute";

    static PaymentSchedule_Execute = EnvConfig.getApiHost() + "/api/PaymentSchedule/Execute";

    static DebtContractEntry_Execute = EnvConfig.getApiHost() + "/api/DebtContractEntry/Execute";

    static CollectionDocActHis_Execute = EnvConfig.getApiHost() + "/api/CollectionDocumentActionHistory/Execute";

    static CollectionDocAction_Execute = EnvConfig.getApiHost() + "/api/CollectionDocumentAction/Execute";

    static CollectionDocActionField_Execute = EnvConfig.getApiHost() + "/api/CollectionDocumentActionField/Execute";

    static Attachment_Execute = EnvConfig.getApiHost() + "/api/Attachment/Execute";

    static SyncAttachment_Execute = EnvConfig.getApiHost() + "/api/SyncAttachment/Execute";

    static PromiseToPay_Execute = EnvConfig.getApiHost() + "/api/PromiseToPay/Execute";

    static Customer_Execute = EnvConfig.getApiHost() + "/api/mobile/Customer/Execute";

    static DebtContractAnnex_Execute = EnvConfig.getApiHost() + "/api/DebtContractAnnex/Execute";

    static PDFViewer = EnvConfig.getApiHost() + "/Common/PDFViewer.aspx";

    // new
    static ProcessValuationDocument_Execute = EnvConfig.getApiHost() + "/api/ProcessValuationDocument/Execute";
    static QuickValuation_Execute = EnvConfig.getApiHost() + "/api/QuickValuation/Execute";
    static ProcessValuation_Execute = EnvConfig.getApiHost() + "/api/ProcessValuation/Execute";
}

export default ApiUrl;
